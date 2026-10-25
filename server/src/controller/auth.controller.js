import AuthService from "../services/auth.Service.js";
import ApiResponse from "../utils/apiResponse.js";

// POST /api/v1/auth/register
export const register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json(new ApiResponse(201, { user }, "Registration successful"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/login
export const login = async (req, res, next) => {
  try {
    const deviceInfo = {
      userAgent: req.headers["user-agent"] || null,
      ip: req.ip || null,
    };
    const { user, accessToken, refreshToken } = await AuthService.login({
      ...req.body,
      deviceInfo,
    });
    res
      .status(200)
      .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/refresh
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: raw } = req.body;
    const tokens = await AuthService.refreshAccessToken(raw);
    res.status(200).json(new ApiResponse(200, tokens, "Token refreshed"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/logout
export const logout = async (req, res, next) => {
  try {
    const { refreshToken: raw } = req.body;
    await AuthService.logout(req.user._id, raw);
    res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const result = await AuthService.forgotPassword(req.body.email);
    // result is null when email not found — respond identically to prevent email enumeration
    // In production, email the reset link here (result?.resetToken)
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If that email is registered, a password reset link has been sent"
        )
      );
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    await AuthService.resetPassword(req.params.token, req.body.password);
    res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/send-otp
export const sendEmailOtp = async (req, res, next) => {
  try {
    const otp = await AuthService.sendEmailVerificationOtp(req.user._id);
    // In production, email the OTP — never return it in the response
    res
      .status(200)
      .json(new ApiResponse(200, null, "Verification OTP sent to your email"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/verify-email
export const verifyEmail = async (req, res, next) => {
  try {
    await AuthService.verifyEmailOtp(req.user._id, req.body.otp);
    res.status(200).json(new ApiResponse(200, null, "Email verified successfully"));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await AuthService.changePassword(req.user._id, currentPassword, newPassword);
    res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
  } catch (error) {
    next(error);
  }
};
