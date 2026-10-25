"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "AUD", label: "AUD (A$)" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ja", label: "日本語" },
];

const inputClass =
  "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

export default function Profile() {
  const router = useRouter();
  const { user, updateMe, fetchMe } = useAuthStore();

  const [profile, setProfile] = useState({});
  const [checked, setChecked] = useState(false); // finished loading the user once
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 1. Load the logged-in user once
  useEffect(() => {
    const init = async () => {
      try {
        await fetchMe();
      } finally {
        setChecked(true);
      }
    };
    init();
  }, [fetchMe]);

  // 2. Not logged in -> go to login
  useEffect(() => {
    if (checked && !user) router.push("/login");
  }, [checked, user, router]);

  // 3. Copy the user into the form whenever the store user changes
  useEffect(() => {
    if (user) setProfile(user);
  }, [user]);

  const updateField = (field, value) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const updatePref = (field, value) =>
    setProfile((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      // Send only the fields the user can edit
      const updated = await updateMe({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        preferences: profile.preferences,
      });

      const next =
        updated?.data?.data?.user ?? updated?.data?.user ?? updated?.user;
      if (next) setProfile(next);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!checked || !user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          My Profile
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium mb-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={profile.fullName || ""}
              onChange={(e) => updateField("fullName", e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={profile.email || ""}
              className={`${inputClass} bg-gray-100 text-gray-500`}
              readOnly
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={profile.phoneNumber || ""}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <p className="block text-sm font-medium mb-2">Preferences</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  value={profile.preferences?.currency || "USD"}
                  onChange={(e) => updatePref("currency", e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="language"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Language
                </label>
                <select
                  id="language"
                  value={profile.preferences?.language || "en"}
                  onChange={(e) => updatePref("language", e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={profile.preferences?.newsletterSubscribed || false}
              onChange={(e) =>
                updatePref("newsletterSubscribed", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600"
            />
            <span className="text-sm">Subscribe to newsletter</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Account Security</h3>
          <Link
            href="/change-password"
            className="text-indigo-600 hover:underline font-medium"
          >
            Change password
          </Link>
        </div>
      </div>
    </div>
  );
}
