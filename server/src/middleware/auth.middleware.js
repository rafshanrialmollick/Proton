import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../model/user.js";

/**
 * protect — verifies the Bearer JWT in the Authorization header.
 * Attaches the full user document to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required. Please log in.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-__v");
    if (!user) throw new ApiError(401, "User belonging to this token no longer exists.");
    if (!user.isActive) throw new ApiError(403, "Your account has been deactivated.");

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * authorize(...roles) — role-based access guard.
 * Must be used AFTER protect.
 *
 * @example  router.delete("/:id", protect, authorize("admin"), deleteProduct)
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Required role(s): ${roles.join(", ")}`)
      );
    }
    next();
  };
};
