"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userApi, productApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function Wishlist() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        router.push("/login");
        return;
      }
      setLoading(true);
      try {
        const res = await userApi.getWishlist();
        const productIds = res.data.wishlist || [];
        // Fetch product details for these IDs
        if (productIds.length > 0) {
          const products = await Promise.all(
            productIds.map((id) => productApi.getById(id))
          );
          setWishlistItems(products.map((p) => p.data.product));
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        setError("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      await userApi.removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  if (loading || (!user && !wishlistItems.length)) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-center bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Wishlist</h2>
          <p className="text-gray-600 mb-6">
            Please <Link href="/login" className="text-indigo-600 hover:underline">log in</Link> to view your wishlist.
          </p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-center bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-6">
            Add products to your wishlist from the product pages.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Wishlist</h2>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-indigo-600"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="space-y-4">
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-lg p-4 flex items-start space-x-4"
            >
              <img
                src={product.images?.[0]?.url || `https://picsum.photos/seed/${product._id}/80/80`}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      // Move to cart logic
                      alert("Added to cart! (Functionality pending)");
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {wishlistItems.length > 0 && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">You have {wishlistItems.length} item(s) saved for later</h3>
              <p className="text-gray-600">
                Items in your wishlist are not reserved and may sell out.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
