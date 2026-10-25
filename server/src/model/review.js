import mongoose from "mongoose";

// ── Embedded sub-schemas ──────────────────────────────────────────────────────

/**
 * A single media attachment (image/video) uploaded alongside a review.
 */
const reviewMediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: { values: ["image", "video"], message: "{VALUE} is not a valid media type" },
      default: "image",
    },
  },
  { _id: true }
);

/**
 * A reply from the seller / admin on a customer review.
 */
const sellerReplySchema = new mongoose.Schema(
  {
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    repliedAt: { type: Date, default: Date.now },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: false }
);

// ── Main review schema ────────────────────────────────────────────────────────

const reviewSchema = new mongoose.Schema(
  {
    // ── Relations ─────────────────────────────────────────────────────────────
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },

    // Optional: link to the specific order that triggered the review
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // ── Content ───────────────────────────────────────────────────────────────
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      validate: {
        validator: Number.isInteger,
        message: "Rating must be a whole number",
      },
    },

    title: {
      type: String,
      trim: true,
      maxlength: [120, "Review title must be at most 120 characters"],
      default: null,
    },

    body: {
      type: String,
      trim: true,
      maxlength: [5000, "Review body must be at most 5000 characters"],
      default: null,
    },

    media: {
      type: [reviewMediaSchema],
      default: [],
      validate: {
        validator: (v) => v.length <= 10,
        message: "A review may include at most 10 media files",
      },
    },

    // ── Verified purchase flag ─────────────────────────────────────────────────
    isVerifiedPurchase: {
      type: Boolean,
      default: false,           // set to true when the linked order is confirmed
    },

    // ── Moderation ────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "{VALUE} is not a valid review status",
      },
      default: "pending",       // newly submitted reviews await approval
    },

    moderationNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,            // internal note from moderator explaining rejection etc.
      select: false,
    },

    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      select: false,
    },

    moderatedAt: {
      type: Date,
      default: null,
      select: false,
    },

    // ── Helpfulness votes ──────────────────────────────────────────────────────
    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },

    notHelpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Track which users voted (prevent duplicate voting)
    helpfulVoters: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
      select: false,
    },

    notHelpfulVoters: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
      select: false,
    },

    // ── Seller reply ──────────────────────────────────────────────────────────
    sellerReply: {
      type: sellerReplySchema,
      default: null,
    },

    // ── Soft delete ───────────────────────────────────────────────────────────
    deletedAt: { type: Date, default: null, select: false },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────

// One review per user per product (unique compound)
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ deletedAt: 1 });

// ── Middleware ────────────────────────────────────────────────────────────────

// Exclude soft-deleted reviews from find queries
reviewSchema.pre(/^find/, function () {
  this.where({ deletedAt: null });
});

/**
 * After a review is saved, recalculate the product's rating aggregate.
 * Fires on both new reviews and updates (e.g. after approval status changes).
 */
reviewSchema.post("save", async function () {
  await recalculateProductRating(this.product);
});

/**
 * After a review is deleted (hard), recalculate the product rating.
 */
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) await recalculateProductRating(doc.product);
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function recalculateProductRating(productId) {
  const result = await mongoose.model("Review").aggregate([
    { $match: { product: productId, status: "approved", deletedAt: null } },
    {
      $group: {
        _id: "$product",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avg = result[0]?.avg ?? 0;
  const count = result[0]?.count ?? 0;

  await mongoose
    .model("Product")
    .findByIdAndUpdate(productId, { ratingAverage: avg, ratingCount: count });
}

// ── Instance methods ──────────────────────────────────────────────────────────

/** Approve the review. */
reviewSchema.methods.approve = function (moderatorId) {
  this.status = "approved";
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  return this.save();
};

/** Reject the review with an optional note. */
reviewSchema.methods.reject = function (moderatorId, note = null) {
  this.status = "rejected";
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  this.moderationNote = note;
  return this.save();
};

/** Soft-delete the review. */
reviewSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

/**
 * Cast a helpfulness vote.
 * @param {ObjectId} userId
 * @param {"helpful"|"notHelpful"} vote
 */
reviewSchema.methods.castVote = function (userId, vote) {
  const id = userId.toString();

  const alreadyHelpful = this.helpfulVoters.map(String).includes(id);
  const alreadyNotHelpful = this.notHelpfulVoters.map(String).includes(id);

  if (vote === "helpful") {
    if (alreadyHelpful) return;                 // already voted
    if (alreadyNotHelpful) {
      this.notHelpfulVoters.pull(userId);
      this.notHelpfulVotes = Math.max(0, this.notHelpfulVotes - 1);
    }
    this.helpfulVoters.push(userId);
    this.helpfulVotes += 1;
  } else if (vote === "notHelpful") {
    if (alreadyNotHelpful) return;
    if (alreadyHelpful) {
      this.helpfulVoters.pull(userId);
      this.helpfulVotes = Math.max(0, this.helpfulVotes - 1);
    }
    this.notHelpfulVoters.push(userId);
    this.notHelpfulVotes += 1;
  }
};

// ── Static methods ────────────────────────────────────────────────────────────

/** Get rating breakdown (1-5 star counts) for a product. */
reviewSchema.statics.getRatingBreakdown = async function (productId) {
  const breakdown = await this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), status: "approved", deletedAt: null } },
    { $group: { _id: "$rating", count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]);

  const result = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  breakdown.forEach(({ _id, count }) => {
    result[_id] = count;
  });
  return result;
};

// ─────────────────────────────────────────────────────────────────────────────

const Review = mongoose.model("Review", reviewSchema);

export default Review;
