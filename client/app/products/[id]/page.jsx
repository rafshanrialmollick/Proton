// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { productApi, reviewApi } from "@/lib/api";
// import { useAuthStore } from "@/store/authStore";
// import Link from "next/link";

// const STAR_POINTS =
//   "12 2 15.09 8.26 22 9.27 13 12.76 16.18 20.05 12 16.58 7.82 20.05 11 12.76 2 9.27 9.01 8.26";

// // Reusable star row: `filled` stars are yellow, the rest are gray
// function Stars({ filled = 0, total = 5, size = 14 }) {
//   return (
//     <span className="inline-flex items-center">
//       {Array.from({ length: total }, (_, i) => (
//         <svg
//           key={i}
//           width={size}
//           height={size}
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           className={i < filled ? "text-yellow-400" : "text-gray-300"}
//         >
//           <polygon points={STAR_POINTS} />
//         </svg>
//       ))}
//     </span>
//   );
// }

// export default function ProductDetail() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { user } = useAuthStore();

//   const [product, setProduct] = useState(null);
//   const [error, setError] = useState("");
//   const [reviews, setReviews] = useState([]);
//   const [ratingBreakdown, setRatingBreakdown] = useState({});
//   const [reviewForm, setReviewForm] = useState({
//     rating: 5,
//     title: "",
//     body: "",
//   });
//   const [reviewLoading, setReviewLoading] = useState(false);
//   const [reviewError, setReviewError] = useState("");
//   const [reviewSuccess, setReviewSuccess] = useState(false);

//   const getRatingBreakdown = useCallback(async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}/breakdown`,
//       );
//       if (res.ok) {
//         const data = await res.json();
//         setRatingBreakdown(data.data || {});
//       }
//     } catch (err) {
//       console.error("Failed to fetch rating breakdown:", err);
//     }
//   }, [id]);

//   const fetchReviews = useCallback(async () => {
//     const reviewsRes = await reviewApi.getForProduct(id, {
//       page: 1,
//       limit: 10,
//       sort: "newest",
//     });
//     const data = reviewsRes.data.data ?? reviewsRes.data;
//     setReviews(data.reviews ?? []);
//   }, [id]);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await productApi.getById(id);
//         const data = res.data.data ?? res.data;
//         const prod = data.product ?? data;
//         if (!prod?._id) throw new Error("Product not found in response");
//         setProduct(prod);
//       } catch (err) {
//         console.error(
//           "PRODUCT ERROR:",
//           err.response?.status,
//           err.response?.data ?? err.message,
//         );
//         setError(err.response?.data?.message || err.message);
//         return;
//       }

//       // Reviews failing should not hide the product
//       try {
//         await fetchReviews();
//       } catch (err) {
//         console.error("REVIEWS ERROR:", err.response?.data ?? err.message);
//       }
//       getRatingBreakdown();
//     };

//     fetchProduct();
//   }, [id, fetchReviews, getRatingBreakdown]);

//   const handleReviewChange = (e) => {
//     const { name, value } = e.target;
//     setReviewForm((prev) => ({
//       ...prev,
//       [name]: name === "rating" ? parseInt(value, 10) : value,
//     }));
//   };

//   const handleSubmitReview = async (e) => {
//     e.preventDefault();
//     if (!user) {
//       router.push("/login");
//       return;
//     }

//     setReviewLoading(true);
//     setReviewError("");
//     setReviewSuccess(false);

//     try {
//       await reviewApi.create(id, {
//         rating: reviewForm.rating,
//         title: reviewForm.title,
//         body: reviewForm.body,
//       });
//       setReviewSuccess(true);
//       setReviewForm({ rating: 5, title: "", body: "" });
//       await fetchReviews();
//       getRatingBreakdown();
//     } catch (err) {
//       setReviewError(err.response?.data?.message || "Failed to submit review");
//     } finally {
//       setReviewLoading(false);
//     }
//   };

//   if (error) {
//     return (
//       <div className="p-6 max-w-4xl mx-auto">
//         <p className="text-red-500 mb-4">{error}</p>
//         <Link href="/" className="text-sm text-indigo-600">
//           ← Back to shop
//         </Link>
//       </div>
//     );
//   }

//   if (!product) {
//     return <div className="p-6">Loading...</div>;
//   }

//   const showVotes = (review) =>
//     review.helpfulVotes > 0 || review.notHelpfulVotes > 0;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-4xl mx-auto">
//         <Link href="/" className="text-sm text-indigo-600 mb-4 inline-block">
//           ← Back to shop
//         </Link>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-lg shadow overflow-hidden">
//           {/* Images */}
//           <div className="lg:col-span-2 space-y-4">
//             <img
//               src={
//                 product.images?.[0]?.url ||
//                 `https://picsum.photos/seed/${product._id}/600/400`
//               }
//               alt={product.name}
//               className="w-full h-96 object-cover rounded-lg"
//             />
//             {product.images?.slice(1, 4).map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img.url}
//                 alt={`${product.name} ${idx + 2}`}
//                 className="w-full h-32 object-cover rounded-lg"
//               />
//             ))}
//           </div>

//           {/* Info */}
//           <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

//             <div className="flex items-center mb-2">
//               <span className="text-xl font-semibold text-indigo-600">
//                 ${product.price.toFixed(2)}
//               </span>
//               {product.compareAtPrice && (
//                 <span className="ml-2 text-gray-400 line-through text-sm">
//                   ${product.compareAtPrice.toFixed(2)}
//                 </span>
//               )}
//             </div>

//             {product.ratingCount > 0 && (
//               <div className="flex items-center mb-4 text-gray-600">
//                 <Stars filled={Math.round(product.ratingAverage)} size={16} />
//                 <span className="ml-2">{product.ratingAverage.toFixed(1)}</span>
//                 <span className="ml-1">({product.ratingCount} reviews)</span>
//               </div>
//             )}

//             <p className="text-gray-700 mb-4 line-clamp-4">
//               {product.shortDescription ||
//                 product.description?.substring(0, 200)}
//             </p>

//             {user && (
//               <button
//                 onClick={() => {
//                   // Add to cart logic would go here
//                   alert(
//                     "Added to cart! (Cart functionality to be implemented)",
//                   );
//                 }}
//                 className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
//               >
//                 Add to Cart
//               </button>
//             )}

//             <button
//               onClick={() => {
//                 // Wishlist logic would go here
//                 alert(
//                   "Added to wishlist! (Wishlist functionality to be implemented)",
//                 );
//               }}
//               className="w-full mt-2 border border-indigo-600 text-indigo-600 bg-white py-3 px-4 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
//             >
//               Add to Wishlist
//             </button>
//           </div>
//         </div>

//         {/* Description */}
//         {product.description && (
//           <div className="mt-8 bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Product Description</h2>
//             <div className="prose max-w-none text-gray-700">
//               {product.description}
//             </div>
//           </div>
//         )}

//         {/* Reviews Section */}
//         <div className="mt-8">
//           <h2 className="text-xl font-bold mb-4">
//             Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
//           </h2>

//           {ratingBreakdown && Object.keys(ratingBreakdown).length > 0 && (
//             <div className="mb-6 grid grid-cols-6 text-center text-sm">
//               <div className="font-medium">Rating</div>
//               {[5, 4, 3, 2, 1].map((star) => (
//                 <div key={star} className="font-medium">
//                   {star}
//                   <Stars filled={star} total={star} size={10} />
//                 </div>
//               ))}
//               <div className="font-medium">Count</div>
//               {[5, 4, 3, 2, 1].map((star) => (
//                 <div key={star}>{ratingBreakdown[star] || 0}</div>
//               ))}
//             </div>
//           )}

//           {user ? (
//             <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
//               <h3 className="font-semibold mb-2">Write a review</h3>
//               <form onSubmit={handleSubmitReview} className="space-y-4">
//                 <div className="flex items-center space-x-2">
//                   <span>Rating: </span>
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <label
//                       key={star}
//                       className="flex items-center cursor-pointer"
//                     >
//                       <input
//                         type="radio"
//                         name="rating"
//                         value={star}
//                         checked={reviewForm.rating === star}
//                         onChange={handleReviewChange}
//                         className="mr-1"
//                       />
//                       <Stars filled={star} total={star} size={12} />
//                     </label>
//                   ))}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={reviewForm.title}
//                     onChange={handleReviewChange}
//                     className="w-full p-2 border rounded"
//                     placeholder="Review title (optional)"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Review
//                   </label>
//                   <textarea
//                     name="body"
//                     value={reviewForm.body}
//                     onChange={handleReviewChange}
//                     className="w-full p-2 border rounded"
//                     rows={4}
//                     placeholder="Share your experience..."
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={reviewLoading}
//                   className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
//                 >
//                   {reviewLoading ? "Submitting..." : "Submit Review"}
//                 </button>

//                 {reviewError && (
//                   <p className="mt-2 text-red-500 text-sm">{reviewError}</p>
//                 )}
//                 {reviewSuccess && (
//                   <p className="mt-2 text-green-500 text-sm">
//                     Thank you for your review!
//                   </p>
//                 )}
//               </form>
//             </div>
//           ) : (
//             <p className="text-gray-500">
//               Please{" "}
//               <Link href="/login" className="text-indigo-600 hover:underline">
//                 log in
//               </Link>{" "}
//               to leave a review.
//             </p>
//           )}

//           {/* Reviews List */}
//           <div className="mt-6 space-y-4">
//             {reviews.length > 0 ? (
//               reviews.map((review) => (
//                 <div key={review._id} className="border-t border-gray-100 pt-4">
//                   <div className="flex items-start space-x-3">
//                     <img
//                       src={
//                         review.user?.avatar ||
//                         `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                           review.user?.fullName || "User",
//                         )}&background=random`
//                       }
//                       alt={review.user?.fullName || "User"}
//                       className="w-10 h-10 rounded-full flex-shrink-0"
//                     />
//                     <div className="flex-1">
//                       <div className="flex justify-between items-start mb-2">
//                         <h3 className="font-medium">
//                           {review.user?.fullName || "Anonymous"}
//                         </h3>
//                         <span className="text-sm text-gray-500">
//                           {new Date(review.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>

//                       <Stars filled={review.rating} size={12} />

//                       {review.title && (
//                         <h4 className="font-medium mt-1">{review.title}</h4>
//                       )}
//                       <p className="text-gray-700 mt-2">{review.body}</p>

//                       {showVotes(review) && (
//                         <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
//                           <button
//                             onClick={() => {
//                               // Vote helpful logic
//                             }}
//                             className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
//                           >
//                             <span>👍</span>
//                             <span>{review.helpfulVotes}</span>
//                           </button>
//                           <button
//                             onClick={() => {
//                               // Vote not helpful logic
//                             }}
//                             className="flex items-center space-x-1 text-gray-500 hover:text-gray-600"
//                           >
//                             <span>👎</span>
//                             <span>{review.notHelpfulVotes}</span>
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 text-center py-8">No reviews yet.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { productApi, reviewApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const STAR_POINTS =
  "12 2 15.09 8.26 22 9.27 13 12.76 16.18 20.05 12 16.58 7.82 20.05 11 12.76 2 9.27 9.01 8.26";

function Star({ filled, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={filled ? "text-amber-400" : "text-gray-300"}
    >
      <polygon points={STAR_POINTS} />
    </svg>
  );
}

function Stars({ value = 0, size = 16 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= value} size={size} />
      ))}
    </span>
  );
}

// ক্লিক করে rating দেওয়ার জন্য
function RatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onClick={() => onChange(i)}
          aria-label={`${i} star`}
          className="transition hover:scale-110"
        >
          <Star filled={i <= (hover || value)} size={28} />
        </button>
      ))}
    </div>
  );
}

function ProductDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [breakdown, setBreakdown] = useState({});
  const [form, setForm] = useState({ rating: 5, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const loadReviews = useCallback(async () => {
    try {
      const res = await reviewApi.getForProduct(id, {
        page: 1,
        limit: 10,
        sort: "newest",
      });
      const data = res.data.data ?? res.data;
      setReviews(data.reviews ?? []);
    } catch (err) {
      console.error("REVIEWS ERROR:", err.response?.data ?? err.message);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}/breakdown`,
      );
      if (res.ok) {
        const json = await res.json();
        setBreakdown(json.data || {});
      }
    } catch (err) {
      console.error("BREAKDOWN ERROR:", err);
    }
  }, [id]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productApi.getById(id);
        const data = res.data.data ?? res.data;
        const prod = data.product ?? data;
        if (!prod?._id) throw new Error("Product not found");
        setProduct(prod);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        return;
      }
      loadReviews(); // review fail করলেও product দেখাবে
    };
    load();
  }, [id, loadReviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return router.push("/login");

    setSubmitting(true);
    setReviewError("");
    setReviewSuccess(false);
    try {
      await reviewApi.create(id, form);
      setReviewSuccess(true);
      setForm({ rating: 5, title: "", body: "" });
      await loadReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) return router.push("/login");
    // TODO: cart API call এখানে হবে
  };

  // ── Error / Loading ─────────────────────────────────────────────
  if (error) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
        <Link
          href="/products"
          className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to products
        </Link>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl animate-pulse px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-96 rounded-2xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-6 w-1/4 rounded bg-gray-200" />
            <div className="h-24 rounded bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  // ── Derived values ──────────────────────────────────────────────
  const images = (product.images ?? []).map((i) => i.url).filter(Boolean);
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasDiscount
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;
  const outOfStock = product.trackInventory && product.stock <= 0;
  const totalRatings = Object.values(breakdown).reduce(
    (sum, n) => sum + Number(n || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="mb-6 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to products
        </Link>

        {/* Product */}
        <section className="grid gap-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
              {images.length > 0 ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                      i === activeImage
                        ? "ring-indigo-600"
                        : "ring-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.brand && (
              <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                {product.brand}
              </p>
            )}
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {product.ratingCount > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <Stars value={Math.round(product.ratingAverage)} />
                <span className="font-medium">
                  {product.ratingAverage.toFixed(1)}
                </span>
                <span>({product.ratingCount} reviews)</span>
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price?.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-gray-600">
              {product.shortDescription || product.description}
            </p>

            <p
              className={`mt-5 text-sm font-medium ${
                outOfStock ? "text-red-600" : "text-green-600"
              }`}
            >
              {outOfStock ? "Out of stock" : "In stock"}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>
          </div>
        </section>

        {/* Description */}
        {product.description && product.shortDescription && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              Description
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-gray-600">
              {product.description}
            </p>
          </section>
        )}

        {/* Reviews */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left: summary + form */}
          <div className="space-y-6 lg:col-span-1">
            {totalRatings > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Rating summary
                </h2>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = Number(breakdown[star] || 0);
                    const percent = (count / totalRatings) * 100;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <span className="w-4">{star}</span>
                        <Star filled size={14} />
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Write a review
              </h2>

              {user ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <RatingInput
                    value={form.rating}
                    onChange={(rating) => setForm((p) => ({ ...p, rating }))}
                  />
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title (optional)"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <textarea
                    name="body"
                    value={form.body}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Share your experience..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit review"}
                  </button>
                  {reviewError && (
                    <p className="text-sm text-red-500">{reviewError}</p>
                  )}
                  {reviewSuccess && (
                    <p className="text-sm text-green-600">
                      Thank you for your review!
                    </p>
                  )}
                </form>
              ) : (
                <p className="text-sm text-gray-500">
                  Please{" "}
                  <Link
                    href="/login"
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    log in
                  </Link>{" "}
                  to leave a review.
                </p>
              )}
            </div>
          </div>

          {/* Right: list */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Customer reviews
              {product.ratingCount > 0 && ` (${product.ratingCount})`}
            </h2>

            {reviews.length === 0 ? (
              <p className="py-10 text-center text-gray-500">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviews.map((review) => {
                  const name = review.user?.fullName || "Anonymous";
                  return (
                    <article key={review._id} className="flex gap-3 py-5 first:pt-0">
                      <img
                        src={
                          review.user?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
                        }
                        alt={name}
                        className="h-10 w-10 shrink-0 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{name}</h3>
                          <time className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                        <div className="mt-1">
                          <Stars value={review.rating} size={14} />
                        </div>
                        {review.title && (
                          <h4 className="mt-2 font-medium text-gray-900">
                            {review.title}
                          </h4>
                        )}
                        {review.body && (
                          <p className="mt-1 text-sm leading-relaxed text-gray-600">
                            {review.body}
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// Next.js 16: useParams() এর জন্য Suspense লাগে
export default function ProductDetail() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center text-gray-500">Loading...</div>}
    >
      <ProductDetailContent />
    </Suspense>
  );
}