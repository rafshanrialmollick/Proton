import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  sendEmailOtp,
  verifyEmail,
  changePassword,
} from "../controller/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

// Protected
router.post("/logout", protect, logout);
router.post("/send-otp", protect, sendEmailOtp);
router.post("/verify-email", protect, verifyEmail);
router.patch("/change-password", protect, changePassword);

export default router;
