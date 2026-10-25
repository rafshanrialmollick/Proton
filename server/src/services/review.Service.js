import ReviewRepository from "../repository/review.Repository.js";
import ProductRepository from "../repository/product.Repository.js";
import ApiError from "../utils/ApiError.js";

// ── Create ────────────────────────────────────────────────────────────────────

const createReview = async ({ productId, userId, body }) => {
  // Ensure product exists
  const product = await ProductRepository.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  // One review per user per product
  const existing = await ReviewRepository.findOne({ product: productId, user: userId });
  if (existing) throw new ApiError(409, "You have already reviewed this product");

  const review = await ReviewRepository.create({
    product: productId,
    user: userId,
    ...body,
  });

  return review;
};

// ── Get all for a product ─────────────────────────────────────────────────────

const getProductReviews = async (productId, query = {}) => {
  const filter = { product: productId, status: "approved" };

  if (query.rating) filter.rating = Number(query.rating);

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Number(query.limit) || 10);
  const skip = (page - 1) * limit;

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    helpful: { helpfulVotes: -1 },
    rating_high: { rating: -1 },
    rating_low: { rating: 1 },
  };
  const sort = sortMap[query.sort] || { createdAt: -1 };

  const [reviews, total, breakdown] = await Promise.all([
    ReviewRepository.findAll({ filter, sort, skip, limit }),
    ReviewRepository.countAll(filter),
    ReviewRepository.getRatingBreakdown(productId),
  ]);

  return {
    reviews,
    breakdown,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  };
};

// ── Get by ID ─────────────────────────────────────────────────────────────────

const getReviewById = async (id) => {
  const review = await ReviewRepository.findById(id);
  if (!review) throw new ApiError(404, "Review not found");
  return review;
};

// ── Update ────────────────────────────────────────────────────────────────────

const updateReview = async (id, userId, body) => {
  const review = await ReviewRepository.findById(id);
  if (!review) throw new ApiError(404, "Review not found");
  if (review.user.toString() !== userId.toString())
    throw new ApiError(403, "You can only edit your own reviews");

  const updated = await ReviewRepository.updateById(id, { ...body, status: "pending" });
  return updated;
};

// ── Delete (soft) ─────────────────────────────────────────────────────────────

const deleteReview = async (id, userId, role) => {
  const review = await ReviewRepository.findById(id);
  if (!review) throw new ApiError(404, "Review not found");

  const isOwner = review.user.toString() === userId.toString();
  if (!isOwner && role !== "admin" && role !== "moderator") {
    throw new ApiError(403, "You are not authorised to delete this review");
  }

  await review.softDelete();
};

// ── Moderation ────────────────────────────────────────────────────────────────

const getPendingReviews = async (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Number(query.limit) || 20);
  const skip = (page - 1) * limit;

  const filter = { status: "pending" };
  const [reviews, total] = await Promise.all([
    ReviewRepository.findAll({ filter, skip, limit }),
    ReviewRepository.countAll(filter),
  ]);

  return { reviews, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
};

const approveReview = async (id, moderatorId) => {
  const review = await ReviewRepository.findById(id);
  if (!review) throw new ApiError(404, "Review not found");
  return review.approve(moderatorId);
};

const rejectReview = async (id, moderatorId, note) => {
  const review = await ReviewRepository.findById(id);
  if (!review) throw new ApiError(404, "Review not found");
  return review.reject(moderatorId, note);
};

// ── Helpfulness vote ──────────────────────────────────────────────────────────

const castVote = async (id, userId, vote) => {
  const review = await ReviewRepository.findById(id);
  if (!review) throw new ApiError(404, "Review not found");
  review.castVote(userId, vote);
  return review.save();
};

// ── Seller reply ──────────────────────────────────────────────────────────────

const replyToReview = async (id, repliedBy, body) => {
  const review = await ReviewRepository.findById(id);
  if (!review) throw new ApiError(404, "Review not found");
  review.sellerReply = { body, repliedBy, repliedAt: new Date() };
  return review.save();
};

export default {
  createReview,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getPendingReviews,
  approveReview,
  rejectReview,
  castVote,
  replyToReview,
};
