import mongoose from "mongoose";
import crypto from "crypto";

// ── Token types ───────────────────────────────────────────────────────────────

const TOKEN_TYPES = Object.freeze({
  REFRESH: "refresh",
  EMAIL_VERIFY: "emailVerify",
  PASSWORD_RESET: "passwordReset",
  OTP: "otp",
});

// ── Auth token schema ─────────────────────────────────────────────────────────
// One document per issued token.  Expired docs are purged by TTL index.

const authTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: {
        values: Object.values(TOKEN_TYPES),
        message: "{VALUE} is not a recognised token type",
      },
      required: true,
    },

    // For refresh / password-reset / email-verify: store as SHA-256 hash
    // to avoid leaking raw tokens from the DB.
    tokenHash: {
      type: String,
      required: true,
      select: false,
    },

    // For OTP (6-digit pin): store hashed OTP here
    otpHash: {
      type: String,
      default: null,
      select: false,
    },

    // OTP attempt counter — lock out after N wrong tries
    otpAttempts: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    // Whether the token has already been consumed (single-use enforcement)
    isUsed: {
      type: Boolean,
      default: false,
    },

    // Device / session metadata (useful for "active sessions" UX)
    deviceInfo: {
      userAgent: { type: String, default: null },
      ip: { type: String, default: null },
      platform: { type: String, default: null },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────

// TTL index — MongoDB auto-deletes expired token documents
authTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Composite index for fast lookup: user + type + isUsed
authTokenSchema.index({ user: 1, type: 1, isUsed: 1 });

// ── Static helpers ────────────────────────────────────────────────────────────

/**
 * Generate a cryptographically secure random token string
 * and return both the raw value (to send to client) and its SHA-256 hash
 * (to persist in DB).
 */
authTokenSchema.statics.generateToken = function () {
  const raw = crypto.randomBytes(40).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
};

/**
 * Hash a raw token for DB lookup.
 */
authTokenSchema.statics.hashToken = function (raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
};

/**
 * Generate a 6-digit numeric OTP and its hash.
 */
authTokenSchema.statics.generateOtp = function () {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const hash = crypto.createHash("sha256").update(otp).digest("hex");
  return { otp, hash };
};

/**
 * Revoke all active tokens of a given type for a user.
 */
authTokenSchema.statics.revokeAll = function (userId, type) {
  return this.updateMany(
    { user: userId, type, isUsed: false },
    { $set: { isUsed: true } }
  );
};

// ── Instance methods ──────────────────────────────────────────────────────────

/**
 * Mark this token as used (consumed).
 */
authTokenSchema.methods.consume = function () {
  this.isUsed = true;
  return this.save();
};

/**
 * Check whether a raw OTP matches this token's stored hash.
 */
authTokenSchema.methods.verifyOtp = function (candidateOtp) {
  const hash = crypto
    .createHash("sha256")
    .update(candidateOtp)
    .digest("hex");
  return hash === this.otpHash;
};

// ─────────────────────────────────────────────────────────────────────────────

const AuthToken = mongoose.model("AuthToken", authTokenSchema);

export { TOKEN_TYPES };
export default AuthToken;
