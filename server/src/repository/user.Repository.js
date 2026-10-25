import User from "../model/user.js";

const findAll = ({ filter = {}, skip = 0, limit = 20 } = {}) =>
  User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

const countAll = (filter = {}) => User.countDocuments(filter);

const findById = (id) => User.findById(id);

const updateById = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) => User.findByIdAndDelete(id);

// ── Cart ──────────────────────────────────────────────────────────────────────

const addToCart = (id, item) =>
  User.findByIdAndUpdate(
    id,
    { $push: { cart: item } },
    { new: true, runValidators: true }
  );

const removeFromCart = (id, cartItemId) =>
  User.findByIdAndUpdate(
    id,
    { $pull: { cart: { _id: cartItemId } } },
    { new: true }
  );

const clearCart = (id) =>
  User.findByIdAndUpdate(id, { $set: { cart: [] } }, { new: true });

// ── Wishlist ──────────────────────────────────────────────────────────────────

const addToWishlist = (id, productId) =>
  User.findByIdAndUpdate(
    id,
    { $addToSet: { wishlist: productId } },
    { new: true }
  );

const removeFromWishlist = (id, productId) =>
  User.findByIdAndUpdate(
    id,
    { $pull: { wishlist: productId } },
    { new: true }
  );

// ── Addresses ─────────────────────────────────────────────────────────────────

const addAddress = (id, address) =>
  User.findByIdAndUpdate(
    id,
    { $push: { addresses: address } },
    { new: true, runValidators: true }
  );

const removeAddress = (id, addressId) =>
  User.findByIdAndUpdate(
    id,
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  );

export default {
  findAll,
  countAll,
  findById,
  updateById,
  deleteById,
  addToCart,
  removeFromCart,
  clearCart,
  addToWishlist,
  removeFromWishlist,
  addAddress,
  removeAddress,
};
