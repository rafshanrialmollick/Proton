import { Router } from "express";
import {
  getAllUsers,
  getMe,
  getUserById,
  updateProfile,
  adminUpdateUser,
  deleteUser,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getAddresses,
  addAddress,
  removeAddress,
} from "../controller/user.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// All user routes require authentication
router.use(protect);

// ── Profile ───────────────────────────────────────────────────────────────────
router.get("/me", getMe);
router.patch("/me", updateProfile);

// ── Cart ──────────────────────────────────────────────────────────────────────
router.get("/me/cart", getCart);
router.post("/me/cart", addToCart);
router.delete("/me/cart", clearCart);
router.delete("/me/cart/:itemId", removeFromCart);

// ── Wishlist ──────────────────────────────────────────────────────────────────
router.get("/me/wishlist", getWishlist);
router.post("/me/wishlist", addToWishlist);
router.delete("/me/wishlist/:productId", removeFromWishlist);

// ── Addresses ─────────────────────────────────────────────────────────────────
router.get("/me/addresses", getAddresses);
router.post("/me/addresses", addAddress);
router.delete("/me/addresses/:addressId", removeAddress);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get("/", authorize("admin"), getAllUsers);
router.get("/:id", authorize("admin"), getUserById);
router.patch("/:id", authorize("admin"), adminUpdateUser);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
