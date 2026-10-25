import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";
import {
  getProductReviews,
  createReview,
} from "../controller/review.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", getAllProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);
router.get("/:productId/reviews", getProductReviews);

// ── Customer ──────────────────────────────────────────────────────────────────
router.post("/:productId/reviews", protect, createReview);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.post("/", protect, authorize("admin"), createProduct);
router.patch("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
