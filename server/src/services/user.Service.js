import UserRepository from "../repository/user.Repository.js";
import ProductRepository from "../repository/product.Repository.js";
import ApiError from "../utils/ApiError.js";

// ── Admin: all users ──────────────────────────────────────────────────────────

const getAllUsers = async (query = {}) => {
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Number(query.limit) || 20);
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    UserRepository.findAll({ filter, skip, limit }),
    UserRepository.countAll(filter),
  ]);

  return { users, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
};

// ── Single user ───────────────────────────────────────────────────────────────

const getUserById = async (id) => {
  const user = await UserRepository.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

// ── Update profile ────────────────────────────────────────────────────────────

const updateProfile = async (id, data) => {
  // Strip fields that must not be updated via this route
  const { password, role, isActive, deletedAt, ...safe } = data;

  const user = await UserRepository.updateById(id, safe);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

// ── Admin: update any user ────────────────────────────────────────────────────

const adminUpdateUser = async (id, data) => {
  const user = await UserRepository.updateById(id, data);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

// ── Delete (soft) ─────────────────────────────────────────────────────────────

const deleteUser = async (id) => {
  const user = await UserRepository.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  await user.softDelete();
};

// ── Cart ──────────────────────────────────────────────────────────────────────

const addToCart = async (userId, { productId, variantId, quantity }) => {
  const product = await ProductRepository.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (product.status !== "active") throw new ApiError(400, "Product is not available");

  const priceSnapshot = product.price;
  const user = await UserRepository.addToCart(userId, {
    product: productId,
    variant: variantId || null,
    quantity: quantity || 1,
    priceSnapshot,
  });
  if (!user) throw new ApiError(404, "User not found");
  return user.cart;
};

const removeFromCart = async (userId, cartItemId) => {
  const user = await UserRepository.removeFromCart(userId, cartItemId);
  if (!user) throw new ApiError(404, "User not found");
  return user.cart;
};

const clearCart = async (userId) => {
  const user = await UserRepository.clearCart(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user.cart;
};

// ── Wishlist ──────────────────────────────────────────────────────────────────

const addToWishlist = async (userId, productId) => {
  const product = await ProductRepository.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const user = await UserRepository.addToWishlist(userId, productId);
  return user.wishlist;
};

const removeFromWishlist = async (userId, productId) => {
  const user = await UserRepository.removeFromWishlist(userId, productId);
  if (!user) throw new ApiError(404, "User not found");
  return user.wishlist;
};

// ── Addresses ─────────────────────────────────────────────────────────────────

const addAddress = async (userId, address) => {
  const user = await UserRepository.addAddress(userId, address);
  if (!user) throw new ApiError(404, "User not found");
  return user.addresses;
};

const removeAddress = async (userId, addressId) => {
  const user = await UserRepository.removeAddress(userId, addressId);
  if (!user) throw new ApiError(404, "User not found");
  return user.addresses;
};

export default {
  getAllUsers,
  getUserById,
  updateProfile,
  adminUpdateUser,
  deleteUser,
  addToCart,
  removeFromCart,
  clearCart,
  addToWishlist,
  removeFromWishlist,
  addAddress,
  removeAddress,
};
