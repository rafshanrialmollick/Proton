"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userApi, productApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function Cart() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        router.push("/login");
        return;
      }
      setLoading(true);
      try {
        const res = await userApi.getCart();
        setCartItems(res.data.cart || []);
      } catch (err) {
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const removeItem = async (itemId) => {
    if (!user) return;
    try {
      await userApi.removeFromCart(itemId);
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await userApi.clearCart();
      setCartItems([]);
    } catch (err) {
      setError("Failed to clear cart");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0,
    );
  };

  if (loading || (!user && !cartItems.length)) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-center bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
          <p className="text-gray-600 mb-6">
            Please{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              log in
            </Link>{" "}
            to view your cart.
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-center bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Add some products to your cart to get started.
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
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-indigo-600"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 rounded-lg p-4 flex items-start space-x-4"
            >
              <img
                src={
                  item.product.images?.[0]?.url ||
                  `https://picsum.photos/seed/${item.product._id}/80/80`
                }
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  ${item.priceSnapshot.toFixed(2)} × {item.quantity}
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      // Decrease quantity logic
                    }}
                    className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 12h14"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <span className="px-3 py-1 bg-gray-50 rounded">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      // Increase quantity logic
                    }}
                    className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 5v14"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {cartItems.length > 0 && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <span className="text-gray-600">{cartItems.length} items</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    $${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2 pb-4">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>$${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Checkout logic would go here
                    alert(
                      "Proceeding to checkout... (Checkout integration pending)",
                    );
                  }}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium mt-4"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full mt-3 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
