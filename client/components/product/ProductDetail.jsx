"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { productApi, reviewApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const STAR_POINTS =
  "12 2 15.09 8.26 22 9.27 13 12.76 16.18 20.05 12 16.58 7.82 20.05 11 12.76 2 9.27 9.01 8.26";

// Reusable star row: `filled` stars are yellow, the rest are gray
function Stars({ filled = 0, total = 5, size = 14 }) {
  return (
    <span className="inline-flex items-center">
      {Array.from({ length: total }, (_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={i < filled ? "text-yellow-400" : "text-gray-300"}
        >
          <polygon points={STAR_POINTS} />
        </svg>
      ))}
    </span>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingBreakdown, setRatingBreakdown] = useState({});
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    body: "",
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const getRatingBreakdown = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}/breakdown`,
      );
      if (res.ok) {
        const data = await res.json();
        setRatingBreakdown(data.data || {});
      }
    } catch (err) {
      console.error("Failed to fetch rating breakdown:", err);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    const reviewsRes = await reviewApi.getForProduct(id, {
      page: 1,
      limit: 10,
      sort: "newest",
    });
    setReviews(reviewsRes.data.reviews);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productApi.getById(id);
        setProduct(res.data.product);
        await fetchReviews();
        getRatingBreakdown();
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };

    fetchProduct();
  }, [id, router, fetchReviews, getRatingBreakdown]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess(false);

    try {
      await reviewApi.create(id, {
        rating: reviewForm.rating,
        title: reviewForm.title,
        body: reviewForm.body,
      });
      setReviewSuccess(true);
      setReviewForm({ rating: 5, title: "", body: "" });
      await fetchReviews();
      getRatingBreakdown();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (!product) {
    return <div className="p-6">Loading...</div>;
  }

  const showVotes = (review) =>
    review.helpfulVotes > 0 || review.notHelpfulVotes > 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm text-indigo-600 mb-4 inline-block">
          ← Back to shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-lg shadow overflow-hidden">
          {/* Images */}
          <div className="lg:col-span-2 space-y-4">
            <img
              src={
                product.images?.[0]?.url ||
                `https://picsum.photos/seed/${product._id}/600/400`
              }
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.images?.slice(1, 4).map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`${product.name} ${idx + 2}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Info */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center mb-2">
              <span className="text-xl font-semibold text-indigo-600">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="ml-2 text-gray-400 line-through text-sm">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {product.ratingCount > 0 && (
              <div className="flex items-center mb-4 text-gray-600">
                <Stars filled={Math.round(product.ratingAverage)} size={16} />
                <span className="ml-2">{product.ratingAverage.toFixed(1)}</span>
                <span className="ml-1">({product.ratingCount} reviews)</span>
              </div>
            )}

            <p className="text-gray-700 mb-4 line-clamp-4">
              {product.shortDescription ||
                product.description?.substring(0, 200)}
            </p>

            {user && (
              <button
                onClick={() => {
                  // Add to cart logic would go here
                  alert(
                    "Added to cart! (Cart functionality to be implemented)",
                  );
                }}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Add to Cart
              </button>
            )}

            <button
              onClick={() => {
                // Wishlist logic would go here
                alert(
                  "Added to wishlist! (Wishlist functionality to be implemented)",
                );
              }}
              className="w-full mt-2 border border-indigo-600 text-indigo-600 bg-white py-3 px-4 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
            >
              Add to Wishlist
            </button>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Product Description</h2>
            <div className="prose max-w-none text-gray-700">
              {product.description}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>

          {ratingBreakdown && Object.keys(ratingBreakdown).length > 0 && (
            <div className="mb-6 grid grid-cols-6 text-center text-sm">
              <div className="font-medium">Rating</div>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="font-medium">
                  {star}
                  <Stars filled={star} total={star} size={10} />
                </div>
              ))}
              <div className="font-medium">Count</div>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star}>{ratingBreakdown[star] || 0}</div>
              ))}
            </div>
          )}

          {user ? (
            <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold mb-2">Write a review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span>Rating: </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label
                      key={star}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={reviewForm.rating === star}
                        onChange={handleReviewChange}
                        className="mr-1"
                      />
                      <Stars filled={star} total={star} size={12} />
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={reviewForm.title}
                    onChange={handleReviewChange}
                    className="w-full p-2 border rounded"
                    placeholder="Review title (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Review
                  </label>
                  <textarea
                    name="body"
                    value={reviewForm.body}
                    onChange={handleReviewChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="Share your experience..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>

                {reviewError && (
                  <p className="mt-2 text-red-500 text-sm">{reviewError}</p>
                )}
                {reviewSuccess && (
                  <p className="mt-2 text-green-500 text-sm">
                    Thank you for your review!
                  </p>
                )}
              </form>
            </div>
          ) : (
            <p className="text-gray-500">
              Please{" "}
              <Link href="/login" className="text-indigo-600 hover:underline">
                log in
              </Link>{" "}
              to leave a review.
            </p>
          )}

          {/* Reviews List */}
          <div className="mt-6 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-t border-gray-100 pt-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={
                        review.user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          review.user?.fullName || "User",
                        )}&background=random`
                      }
                      alt={review.user?.fullName || "User"}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">
                          {review.user?.fullName || "Anonymous"}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <Stars filled={review.rating} size={12} />

                      {review.title && (
                        <h4 className="font-medium mt-1">{review.title}</h4>
                      )}
                      <p className="text-gray-700 mt-2">{review.body}</p>

                      {showVotes(review) && (
                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                          <button
                            onClick={() => {
                              // Vote helpful logic
                            }}
                            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
                          >
                            <span>👍</span>
                            <span>{review.helpfulVotes}</span>
                          </button>
                          <button
                            onClick={() => {
                              // Vote not helpful logic
                            }}
                            className="flex items-center space-x-1 text-gray-500 hover:text-gray-600"
                          >
                            <span>👎</span>
                            <span>{review.notHelpfulVotes}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
