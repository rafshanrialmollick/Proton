import mongoose from "mongoose";

// ── Embedded sub-schemas ──────────────────────────────────────────────────────

/**
 * A single option within a variant type, e.g. { value: "Red", sku: "...", stock: 10 }
 */
const variantOptionSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, trim: true }, // "Red", "XL", "500ml"
    sku: { type: String, required: true, trim: true, uppercase: true },
    price: { type: Number, required: true, min: 0 }, // can differ from base price
    compareAtPrice: { type: Number, default: null, min: 0 }, // strikethrough price
    stock: { type: Number, required: true, min: 0, default: 0 },
    weight: { type: Number, default: null, min: 0 }, // grams
    image: { type: String, default: null }, // URL override for this option
    isAvailable: { type: Boolean, default: true },
  },
  { _id: true },
);

/**
 * A grouping of options, e.g. { name: "Color", options: [...] }
 */
const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // "Color", "Size", "Material"
    options: {
      type: [variantOptionSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "A variant must have at least one option",
      },
    },
  },
  { _id: true },
);

/**
 * Product image with alt text and display order.
 */
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    altText: { type: String, trim: true, default: "" },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

/**
 * Shipping dimensions / weight for logistics.
 */
const shippingSchema = new mongoose.Schema(
  {
    weight: { type: Number, default: 0, min: 0 }, // grams
    length: { type: Number, default: 0, min: 0 }, // cm
    width: { type: Number, default: 0, min: 0 }, // cm
    height: { type: Number, default: 0, min: 0 }, // cm
    requiresShipping: { type: Boolean, default: true },
    isFreeShipping: { type: Boolean, default: false },
  },
  { _id: false },
);

/**
 * SEO metadata.
 */
const seoSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, maxlength: 70, default: null },
    description: { type: String, trim: true, maxlength: 160, default: null },
    keywords: { type: [String], default: [] },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase kebab-case",
      ],
    },
  },
  { _id: false },
);

// ── Main product schema ───────────────────────────────────────────────────────

const productSchema = new mongoose.Schema(
  {
    // ── Core ──────────────────────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [200, "Name must be at most 200 characters"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description must be at most 300 characters"],
      default: null,
    },

    // ── Categorisation ────────────────────────────────────────────────────────
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    brand: {
      type: String,
      trim: true,
      default: null,
    },

    tags: {
      type: [String],
      default: [],
    },

    // ── Pricing (base — variants can override) ────────────────────────────────
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    compareAtPrice: {
      type: Number,
      default: null, // null = no sale; value = original/strikethrough price
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
      maxlength: 3,
    },

    // ── Inventory (base — without variants) ───────────────────────────────────
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },

    trackInventory: {
      type: Boolean,
      default: true,
    },

    // ── Variants ──────────────────────────────────────────────────────────────
    hasVariants: { type: Boolean, default: false },
    variants: {
      type: [variantSchema],
      default: [],
    },

    // ── Media ─────────────────────────────────────────────────────────────────
    images: {
      type: [imageSchema],
      default: [],
      validate: {
        validator: (v) => v.length <= 20,
        message: "A product may have at most 20 images",
      },
    },

    // ── Shipping ──────────────────────────────────────────────────────────────
    shipping: {
      type: shippingSchema,
      default: () => ({}),
    },

    // ── SEO / URL ─────────────────────────────────────────────────────────────
    seo: {
      type: seoSchema,
      default: () => ({}),
    },

    // ── Status ────────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: {
        values: ["draft", "active", "archived"],
        message: "{VALUE} is not a valid product status",
      },
      default: "draft",
    },

    isFeatured: { type: Boolean, default: false },
    isDigital: { type: Boolean, default: false }, // downloadable product

    // ── Computed/aggregated fields (updated via Review model hooks) ───────────
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (v) => Math.round(v * 10) / 10, // round to 1 decimal
    },

    ratingCount: { type: Number, default: 0, min: 0 },

    soldCount: { type: Number, default: 0, min: 0 }, // incremented on order completion

    // ── Metadata ──────────────────────────────────────────────────────────────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Soft-delete
    deletedAt: { type: Date, default: null, select: false },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ───────────────────────────────────────────────────────────────────

productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ status: 1, isFeatured: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratingAverage: -1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ "seo.slug": 1 }, { unique: true, sparse: true });
productSchema.index({ sku: 1 }, { unique: true, sparse: true });
productSchema.index({ deletedAt: 1 });

// ── Middleware ────────────────────────────────────────────────────────────────

// Exclude soft-deleted products from all find queries
productSchema.pre(/^find/, function () {
  this.where({ deletedAt: null });
});

// Auto-generate slug from name if not provided
productSchema.pre("save", function (next) {
  if (!this.seo) this.seo = {};
  if (!this.seo.slug && this.name) {
    this.seo.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

// ── Virtual fields ────────────────────────────────────────────────────────────

/** true when stock is at or below the low-stock threshold */
productSchema.virtual("isLowStock").get(function () {
  return this.trackInventory && this.stock <= this.lowStockThreshold;
});

/** Discount percentage relative to compareAtPrice */
productSchema.virtual("discountPercent").get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(
    ((this.compareAtPrice - this.price) / this.compareAtPrice) * 100,
  );
});

// ── Instance methods ──────────────────────────────────────────────────────────

/** Soft-delete the product. */
productSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  this.status = "archived";
  return this.save();
};

/**
 * Decrement stock by qty (used when an order is placed).
 * Throws if trackInventory is on and stock would go negative.
 */
productSchema.methods.decrementStock = function (qty = 1) {
  if (this.trackInventory && this.stock < qty) {
    throw new Error(`Insufficient stock for product "${this.name}"`);
  }
  if (this.trackInventory) this.stock -= qty;
  this.soldCount += qty;
};

/**
 * Recalculate and persist the rating average + count.
 * Call this after each review is created/updated/deleted.
 */
productSchema.methods.updateRating = async function (avg, count) {
  this.ratingAverage = avg;
  this.ratingCount = count;
  return this.save();
};

// ── Static methods ────────────────────────────────────────────────────────────

/** Find all active (published) products. */
productSchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, status: "active" });
};

/** Find featured active products. */
productSchema.statics.findFeatured = function () {
  return this.find({ status: "active", isFeatured: true });
};

// ─────────────────────────────────────────────────────────────────────────────

const Product = mongoose.model("Product", productSchema);

export default Product;
