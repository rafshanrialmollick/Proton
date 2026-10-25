import { Router } from "express";

import authRoutes from "./auth.Routes.js";
import userRoutes from "./user.Routes.js";
import productRoutes from "./product.Routes.js";
import reviewRoutes from "./review.Routes.js";
import contactRoutes from "./contact.Routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/reviews", reviewRoutes);
router.use("/contact", contactRoutes);

export default router;
