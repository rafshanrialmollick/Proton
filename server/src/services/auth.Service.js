import jwt from "jsonwebtoken";
import AuthRepository from "../repository/auth.Repository.js";
import AuthToken, { TOKEN_TYPES } from "../model/auth.js";
import ApiError from "../utils/ApiError.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });

const signRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const RESET_TTL_MS = 10 * 60 * 1000;             // 10 minutes
const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;       // 24 hours

// ── Register ──────────────────────────────────────────────────────────────────

const register = async (body) => {
  const existing = await AuthRepository.findUserByEmail(body.email);
  if (existing) throw new ApiError(409, "Email is already registered");

  const user = await AuthRepository.createUser(body);
  return user;
};

// ── Login ─────────────────────────────────────────────────────────────────────

const login = async ({ email, password, deviceInfo = {} }) => {
  const user = await AuthRepository.findUserByEmail(email);
  if (!user) throw new ApiError(401, "Invalid email or password");
  if (!user.isActive) throw new ApiError(403, "Account is deactivated");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  // Revoke previous refresh tokens for this user
  await AuthRepository.revokeAllTokens(user._id, TOKEN_TYPES.REFRESH);

  // Issue new tokens
  const accessToken = signAccessToken(user._id);
  const { raw: refreshRaw, hash: refreshHash } = AuthToken.generateToken();

  await AuthRepository.createToken({
    user: user._id,
    type: TOKEN_TYPES.REFRESH,
    tokenHash: refreshHash,
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    deviceInfo,
  });

  // Strip password from returned user
  user.password = undefined;
  return { user, accessToken, refreshToken: refreshRaw };
};

// ── Refresh access token ──────────────────────────────────────────────────────

const refreshAccessToken = async (rawToken) => {
  let decoded;
  try {
    decoded = jwt.verify(rawToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const hash = AuthToken.hashToken(rawToken);
  const stored = await AuthRepository.findToken({
    user: decoded.id,
    type: TOKEN_TYPES.REFRESH,
    tokenHash: hash,
    isUsed: false,
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new ApiError(401, "Refresh token is invalid or has expired");
  }

  await stored.consume();

  const user = await AuthRepository.findUserById(decoded.id);
  if (!user) throw new ApiError(401, "User not found");

  const accessToken = signAccessToken(user._id);
  const { raw: newRefreshRaw, hash: newRefreshHash } = AuthToken.generateToken();

  await AuthRepository.createToken({
    user: user._id,
    type: TOKEN_TYPES.REFRESH,
    tokenHash: newRefreshHash,
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
  });

  return { accessToken, refreshToken: newRefreshRaw };
};

// ── Logout ────────────────────────────────────────────────────────────────────

const logout = async (userId, rawToken) => {
  const hash = AuthToken.hashToken(rawToken);
  const stored = await AuthRepository.findToken({
    user: userId,
    type: TOKEN_TYPES.REFRESH,
    tokenHash: hash,
  });
  if (stored) await stored.consume();
};

// ── Forgot password ───────────────────────────────────────────────────────────

const forgotPassword = async (email) => {
  const user = await AuthRepository.findUserByEmail(email);
  // Always respond with success — never leak whether email exists
  if (!user) return null;

  await AuthRepository.revokeAllTokens(user._id, TOKEN_TYPES.PASSWORD_RESET);

  const { raw, hash } = AuthToken.generateToken();
  await AuthRepository.createToken({
    user: user._id,
    type: TOKEN_TYPES.PASSWORD_RESET,
    tokenHash: hash,
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });

  // Return raw token so the caller (controller) can email the link
  return { user, resetToken: raw };
};

// ── Reset password ────────────────────────────────────────────────────────────

const resetPassword = async (rawToken, newPassword) => {
  const hash = AuthToken.hashToken(rawToken);

  const stored = await AuthRepository.findToken({
    type: TOKEN_TYPES.PASSWORD_RESET,
    tokenHash: hash,
    isUsed: false,
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new ApiError(400, "Password reset token is invalid or has expired");
  }

  const user = await AuthRepository.findUserById(stored.user);
  if (!user) throw new ApiError(404, "User not found");

  user.password = newPassword;
  await user.save();
  await stored.consume();

  // Revoke all refresh tokens (force re-login everywhere)
  await AuthRepository.revokeAllTokens(user._id, TOKEN_TYPES.REFRESH);
};

// ── Send email verification OTP ───────────────────────────────────────────────

const sendEmailVerificationOtp = async (userId) => {
  await AuthRepository.revokeAllTokens(userId, TOKEN_TYPES.OTP);

  const { otp, hash } = AuthToken.generateOtp();
  await AuthRepository.createToken({
    user: userId,
    type: TOKEN_TYPES.OTP,
    tokenHash: hash,   // reuse tokenHash field so schema stays simple
    otpHash: hash,
    expiresAt: new Date(Date.now() + VERIFY_TTL_MS),
  });

  // Caller emails the OTP
  return otp;
};

// ── Verify email OTP ──────────────────────────────────────────────────────────

const verifyEmailOtp = async (userId, candidateOtp) => {
  const stored = await AuthRepository.findToken({
    user: userId,
    type: TOKEN_TYPES.OTP,
    isUsed: false,
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new ApiError(400, "OTP is invalid or has expired");
  }

  stored.otpAttempts += 1;
  if (stored.otpAttempts > 5) {
    await stored.consume();
    throw new ApiError(429, "Too many OTP attempts. Please request a new code.");
  }

  if (!stored.verifyOtp(candidateOtp)) {
    await stored.save();
    throw new ApiError(400, `Invalid OTP (${5 - stored.otpAttempts} attempts left)`);
  }

  await stored.consume();

  const user = await AuthRepository.findUserById(userId);
  user.isEmailVerified = true;
  await user.save();
};

// ── Change password (authenticated) ──────────────────────────────────────────

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await AuthRepository.findUserByEmail(
    (await AuthRepository.findUserById(userId)).email
  );

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(400, "Current password is incorrect");

  user.password = newPassword;
  await user.save();

  // Force re-login on other devices
  await AuthRepository.revokeAllTokens(userId, TOKEN_TYPES.REFRESH);
};

export default {
  register,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  sendEmailVerificationOtp,
  verifyEmailOtp,
  changePassword,
};
