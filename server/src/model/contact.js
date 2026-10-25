import mongoose from "mongoose";

// ── Embedded sub-schemas ──────────────────────────────────────────────────────

/**
 * A single message thread entry (customer message or support reply).
 */
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,            // null = submitted by a guest
    },

    senderEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,            // captured for guests who have no account
    },

    body: {
      type: String,
      required: [true, "Message body is required"],
      trim: true,
      maxlength: [5000, "Message body must be at most 5000 characters"],
    },

    isStaffReply: { type: Boolean, default: false },

    attachments: {
      type: [{ url: String, filename: String }],
      default: [],
    },

    readAt: { type: Date, default: null }, // when the other party read this message
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: true,
  }
);

// ── Main contact schema ───────────────────────────────────────────────────────

const contactSchema = new mongoose.Schema(
  {
    // ── Submitter info ────────────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,            // null for guest submissions
      index: true,
    },

    // Guest details (only relevant when user is null)
    guestName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
      default: null,
    },

    guestPhone: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Subject & category ────────────────────────────────────────────────────
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject must be at most 200 characters"],
    },

    category: {
      type: String,
      enum: {
        values: [
          "order_issue",
          "return_refund",
          "product_inquiry",
          "shipping",
          "account",
          "payment",
          "feedback",
          "other",
        ],
        message: "{VALUE} is not a valid category",
      },
      default: "other",
    },

    // Optional links to related order / product
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    relatedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // ── Message thread ────────────────────────────────────────────────────────
    messages: {
      type: [messageSchema],
      default: [],
      validate: {
        validator: (v) => v.length > 0,
        message: "A contact ticket must have at least one message",
      },
    },

    // ── Ticket management ─────────────────────────────────────────────────────
    status: {
      type: String,
      enum: {
        values: ["open", "in_progress", "awaiting_customer", "resolved", "closed"],
        message: "{VALUE} is not a valid ticket status",
      },
      default: "open",
    },

    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "{VALUE} is not a valid priority level",
      },
      default: "medium",
    },

    // Staff member currently handling the ticket
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Internal notes visible only to staff
    internalNote: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
      select: false,
    },

    // Customer satisfaction rating after resolution
    satisfactionRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    resolvedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },

    // Soft-delete
    deletedAt: { type: Date, default: null, select: false },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────

contactSchema.index({ user: 1, status: 1 });
contactSchema.index({ status: 1, priority: -1, createdAt: -1 });
contactSchema.index({ assignedTo: 1, status: 1 });
contactSchema.index({ guestEmail: 1 });
contactSchema.index({ deletedAt: 1 });

// ── Middleware ────────────────────────────────────────────────────────────────

// Exclude soft-deleted tickets from find queries
contactSchema.pre(/^find/, function () {
  this.where({ deletedAt: null });
});

// ── Instance methods ──────────────────────────────────────────────────────────

/** Add a message to the thread. */
contactSchema.methods.addMessage = function ({ sender, senderEmail, body, isStaffReply, attachments }) {
  this.messages.push({ sender, senderEmail, body, isStaffReply, attachments });

  // Auto-update ticket status based on who replied last
  if (isStaffReply) {
    this.status = "awaiting_customer";
  } else if (this.status === "awaiting_customer") {
    this.status = "in_progress";
  }
};

/** Assign the ticket to a staff member. */
contactSchema.methods.assignTo = function (staffId) {
  this.assignedTo = staffId;
  if (this.status === "open") this.status = "in_progress";
};

/** Mark the ticket as resolved. */
contactSchema.methods.resolve = function () {
  this.status = "resolved";
  this.resolvedAt = new Date();
};

/** Close the ticket (final state). */
contactSchema.methods.close = function () {
  this.status = "closed";
  this.closedAt = new Date();
};

/** Soft-delete the ticket. */
contactSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

/** Submit a customer satisfaction rating (1-5) after resolution. */
contactSchema.methods.rateSatisfaction = function (score) {
  if (score < 1 || score > 5) throw new Error("Satisfaction rating must be between 1 and 5");
  this.satisfactionRating = score;
  return this.save();
};

// ── Static methods ────────────────────────────────────────────────────────────

/** Get count of open / in-progress tickets assigned to a staff member. */
contactSchema.statics.getActiveCountForStaff = function (staffId) {
  return this.countDocuments({
    assignedTo: staffId,
    status: { $in: ["open", "in_progress", "awaiting_customer"] },
    deletedAt: null,
  });
};

/** Average satisfaction rating across all resolved tickets. */
contactSchema.statics.getAverageSatisfaction = async function () {
  const result = await this.aggregate([
    { $match: { status: { $in: ["resolved", "closed"] }, satisfactionRating: { $ne: null }, deletedAt: null } },
    { $group: { _id: null, avg: { $avg: "$satisfactionRating" }, count: { $sum: 1 } } },
  ]);
  return result[0] ?? { avg: 0, count: 0 };
};

// ─────────────────────────────────────────────────────────────────────────────

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
