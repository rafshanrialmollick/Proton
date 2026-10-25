import { Router } from "express";
import {
  getReviewById,
  updateReview,
  deleteReview,
  getPendingReviews,
  approveReview,
  rejectReview,
  castVote,
  replyToReview,
} from "../controller/review.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// All review routes require authentication
router.use(protect);

// ── Moderation (admin / moderator) ────────────────────────────────────────────
router.get("/pending", authorize("admin", "moderator"), getPendingReviews);
router.patch("/:id/approve", authorize("admin", "moderator"), approveReview);
router.patch("/:id/reject", authorize("admin", "moderator"), rejectReview);
router.post("/:id/reply", authorize("admin"), replyToReview);

// ── Customer actions ──────────────────────────────────────────────────────────
router.get("/:id", getReviewById);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);
router.post("/:id/vote", castVote);

export default router;
