"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { contactApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function Contact() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "other",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        subject: form.subject,
        message: form.message,
      };
      if (user) {
        payload.userId = user._id;
      } else {
        payload.guestName = form.name;
        payload.guestEmail = form.email;
      }

      await contactApi.create(payload);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "other", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Contact Support
        </h2>
        <p className="text-center text-gray-600 mb-6">
          We're here to help. Please fill out the form below.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
            Your message has been sent! We'll get back to you soon.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!user && (
            <>
              <div className="space-y-3">
                <label className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">
              Subject
            </label>
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="order_issue">Order Issue</option>
              <option value="return_refund">Return/Refund</option>
              <option value="product_inquiry">Product Inquiry</option>
              <option value="shipping">Shipping</option>
              <option value="account">Account</option>
              <option value="payment">Payment</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows="5"
              placeholder="How can we help you?"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
