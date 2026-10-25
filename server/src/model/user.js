// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// // ── Embedded sub-schemas ──────────────────────────────────────────────────────

// const addressSchema = new mongoose.Schema(
//   {
//     label: {
//       type: String,
//       trim: true,
//       enum: {
//         values: ["Home", "Work", "Other"],
//         message: "{VALUE} is not a valid address label",
//       },
//       default: "Home",
//     },
//     fullName: { type: String, trim: true },          // recipient name
//     phoneNumber: { type: String, trim: true },        // recipient phone
//     street: { type: String, required: true, trim: true },
//     city: { type: String, required: true, trim: true },
//     state: { type: String, trim: true },
//     postalCode: { type: String, trim: true },
//     country: { type: String, required: true, trim: true },
//     isDefault: { type: Boolean, default: false },
//   },
//   { _id: true }
// );

// const cartItemSchema = new mongoose.Schema(
//   {
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     variant: {
//       type: mongoose.Schema.Types.ObjectId,
//       default: null,           // set if product has variants (size/colour etc.)
//     },
//     quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"], default: 1 },
//     priceSnapshot: { type: Number, required: true, min: 0 }, // price locked at time of add
//   },
//   { _id: true }
// );

// // ── Main user schema ──────────────────────────────────────────────────────────

// const userSchema = new mongoose.Schema(
//   {
//     // ── Identity ─────────────────────────────────────────────────────────────
//     fullName: {
//       type: String,
//       required: [true, "Full name is required"],
//       trim: true,
//       minlength: [2, "Full name must be at least 2 characters"],
//       maxlength: [100, "Full name must be at most 100 characters"],
//     },

//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       lowercase: true,
//       trim: true,
//       match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
//     },

//     phoneNumber: {
//       type: String,
//       trim: true,
//       match: [/^\+?[\d\s\-().]{7,20}$/, "Please enter a valid phone number"],
//       default: null,
//     },

//     avatar: {
//       type: String,
//       trim: true,
//       default: null,          // Cloudinary / S3 URL
//     },

//     // ── Auth ──────────────────────────────────────────────────────────────────
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [8, "Password must be at least 8 characters"],
//       select: false,
//     },

//     role: {
//       type: String,
//       enum: {
//         values: ["customer", "admin", "moderator"],
//         message: "{VALUE} is not a valid role",
//       },
//       default: "customer",
//     },

//     // ── Verification & Account flags ─────────────────────────────────────────
//     isEmailVerified: { type: Boolean, default: false },
//     isActive: { type: Boolean, default: true },

//     // Soft-delete: null = active; Date = deleted
//     deletedAt: { type: Date, default: null, select: false },

//     // ── Preferences ───────────────────────────────────────────────────────────
//     preferences: {
//       currency: { type: String, default: "USD", uppercase: true, trim: true },
//       language: { type: String, default: "en", lowercase: true, trim: true },
//       newsletterSubscribed: { type: Boolean, default: false },
//     },

//     // ── E-commerce ────────────────────────────────────────────────────────────
//     addresses: {
//       type: [addressSchema],
//       default: [],
//       validate: {
//         validator: (v) => v.length <= 10,
//         message: "A user may have at most 10 saved addresses",
//       },
//     },

//     cart: {
//       type: [cartItemSchema],
//       default: [],
//       validate: {
//         validator: (v) => v.length <= 100,
//         message: "Cart cannot exceed 100 items",
//       },
//     },

//     wishlist: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
//       default: [],
//     },

//     orders: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
//       default: [],
//     },

//     // Loyalty / reward points
//     rewardPoints: { type: Number, default: 0, min: 0 },

//     // Payment gateway (e.g. Stripe) customer ID – hidden from default responses
//     paymentCustomerId: { type: String, default: null, select: false },
//   },
//   {
//     timestamps: true,
//   }
// );

// // ── Indexes ───────────────────────────────────────────────────────────────────

// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ role: 1 });
// userSchema.index({ deletedAt: 1 });
// userSchema.index({ fullName: "text" });

// // ── Middleware ────────────────────────────────────────────────────────────────

// // Auto-hash password on create / password change
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);
//   return
// });

// // Exclude soft-deleted users from every find query
// userSchema.pre(/^find/, function () {
//   this.where({ deletedAt: null });
// });

// // ── Instance methods ──────────────────────────────────────────────────────────

// /**
//  * Compare a plain-text candidate password against the stored hash.
//  * Requires the document to have been fetched with .select("+password").
//  */
// userSchema.methods.comparePassword = async function (candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// /** Soft-delete this user account. */
// userSchema.methods.softDelete = function () {
//   this.deletedAt = new Date();
//   this.isActive = false;
//   return this.save();
// };

// /** Restore a soft-deleted account. */
// userSchema.methods.restore = function () {
//   this.deletedAt = null;
//   this.isActive = true;
//   return this.save();
// };

// /** Add reward points; does not save — caller must call .save(). */
// userSchema.methods.addRewardPoints = function (points) {
//   this.rewardPoints += points;
// };

// /** Deduct reward points; throws if insufficient balance. */
// userSchema.methods.redeemRewardPoints = function (points) {
//   if (points > this.rewardPoints) {
//     throw new Error("Insufficient reward points");
//   }
//   this.rewardPoints -= points;
// };

// // ── Static methods ────────────────────────────────────────────────────────────

// /** Find a user by email AND include the hidden password field. */
// userSchema.statics.findByEmailWithPassword = function (email) {
//   return this.findOne({ email }).select("+password");
// };

// // ─────────────────────────────────────────────────────────────────────────────

// const User = mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
  label: { type: String, enum: ["Home", "Work", "Other"], default: "Home" },
  fullName: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, required: true, trim: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    phoneNumber: { type: String, trim: true },
    avatar: { type: String, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    addresses: {
      type: [addressSchema],
      validate: [(v) => v.length <= 10, "At most 10 saved addresses"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email }).select("+password");
};

export default mongoose.model("User", userSchema);
