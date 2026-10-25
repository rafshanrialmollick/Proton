import ReviewService from "../services/review.Service.js";
import ApiResponse from "../utils/apiResponse.js";

// GET /api/v1/products/:productId/reviews
export const getProductReviews = async (req, res, next) => {
  try {
    const result = await ReviewService.getProductReviews(req.params.productId, req.query);
    res.status(200).json(new ApiResponse(200, result, "Reviews fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/reviews/:id
export const getReviewById = async (req, res, next) => {
  try {
    const review = await ReviewService.getReviewById(req.params.id);
    res.status(200).json(new ApiResponse(200, review, "Review fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/products/:productId/reviews  [customer]
export const createReview = async (req, res, next) => {
  try {
    const review = await ReviewService.createReview({
      productId: req.params.productId,
      userId: req.user._id,
      body: req.body,
    });
    res.status(201).json(new ApiResponse(201, review, "Review submitted successfully"));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/reviews/:id  [owner]
export const updateReview = async (req, res, next) => {
  try {
    const review = await ReviewService.updateReview(req.params.id, req.user._id, req.body);
    res.status(200).json(new ApiResponse(200, review, "Review updated successfully"));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/reviews/:id  [owner | admin | moderator]
export const deleteReview = async (req, res, next) => {
  try {
    await ReviewService.deleteReview(req.params.id, req.user._id, req.user.role);
    res.status(200).json(new ApiResponse(200, null, "Review deleted successfully"));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/reviews/pending  [admin | moderator]
export const getPendingReviews = async (req, res, next) => {
  try {
    const result = await ReviewService.getPendingReviews(req.query);
    res.status(200).json(new ApiResponse(200, result, "Pending reviews fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/reviews/:id/approve  [admin | moderator]
export const approveReview = async (req, res, next) => {
  try {
    const review = await ReviewService.approveReview(req.params.id, req.user._id);
    res.status(200).json(new ApiResponse(200, review, "Review approved"));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/reviews/:id/reject  [admin | moderator]
export const rejectReview = async (req, res, next) => {
  try {
    const review = await ReviewService.rejectReview(
      req.params.id,
      req.user._id,
      req.body.note
    );
    res.status(200).json(new ApiResponse(200, review, "Review rejected"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/reviews/:id/vote  [customer]
export const castVote = async (req, res, next) => {
  try {
    const review = await ReviewService.castVote(req.params.id, req.user._id, req.body.vote);
    res.status(200).json(new ApiResponse(200, review, "Vote recorded"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/reviews/:id/reply  [admin]
export const replyToReview = async (req, res, next) => {
  try {
    const review = await ReviewService.replyToReview(
      req.params.id,
      req.user._id,
      req.body.body
    );
    res.status(200).json(new ApiResponse(200, review, "Reply added"));
  } catch (error) {
    next(error);
  }
};
