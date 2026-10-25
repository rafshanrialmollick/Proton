import UserService from "../services/user.Service.js";
import ApiResponse from "../utils/apiResponse.js";

// GET /api/v1/users  [admin]
export const getAllUsers = async (req, res, next) => {
  try {
    const result = await UserService.getAllUsers(req.query);
    res
      .status(200)
      .json(new ApiResponse(200, result, "Users fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/users/me  [customer]
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, req.user, "Profile fetched"));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/users/:id  [admin]
export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/users/me  [customer]
export const updateProfile = async (req, res, next) => {
  try {
    const user = await UserService.updateProfile(req.user._id, req.body);
    res
      .status(200)
      .json(new ApiResponse(200, user, "Profile updated successfully"));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/users/:id  [admin]
export const adminUpdateUser = async (req, res, next) => {
  try {
    const user = await UserService.adminUpdateUser(req.params.id, req.body);
    res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/users/:id  [admin]
export const deleteUser = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, null, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
};

// ── Cart ──────────────────────────────────────────────────────────────────────

// GET /api/v1/users/me/cart
export const getCart = async (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, req.user.cart, "Cart fetched"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/users/me/cart
export const addToCart = async (req, res, next) => {
  try {
    const cart = await UserService.addToCart(req.user._id, req.body);
    res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/users/me/cart/:itemId
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await UserService.removeFromCart(
      req.user._id,
      req.params.itemId,
    );
    res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/users/me/cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await UserService.clearCart(req.user._id);
    res.status(200).json(new ApiResponse(200, cart, "Cart cleared"));
  } catch (error) {
    next(error);
  }
};

// ── Wishlist ──────────────────────────────────────────────────────────────────

// GET /api/v1/users/me/wishlist
export const getWishlist = async (req, res, next) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, req.user.wishlist, "Wishlist fetched"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/users/me/wishlist
export const addToWishlist = async (req, res, next) => {
  try {
    const wishlist = await UserService.addToWishlist(
      req.user._id,
      req.body.productId,
    );
    res.status(200).json(new ApiResponse(200, wishlist, "Added to wishlist"));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/users/me/wishlist/:productId
export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await UserService.removeFromWishlist(
      req.user._id,
      req.params.productId,
    );
    res
      .status(200)
      .json(new ApiResponse(200, wishlist, "Removed from wishlist"));
  } catch (error) {
    next(error);
  }
};

// ── Addresses ─────────────────────────────────────────────────────────────────

// GET /api/v1/users/me/addresses
export const getAddresses = async (req, res, next) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, req.user.addresses, "Addresses fetched"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/users/me/addresses
export const addAddress = async (req, res, next) => {
  try {
    const addresses = await UserService.addAddress(req.user._id, req.body);
    res.status(201).json(new ApiResponse(201, addresses, "Address added"));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/users/me/addresses/:addressId
export const removeAddress = async (req, res, next) => {
  try {
    const addresses = await UserService.removeAddress(
      req.user._id,
      req.params.addressId,
    );
    res.status(200).json(new ApiResponse(200, addresses, "Address removed"));
  } catch (error) {
    next(error);
  }
};
