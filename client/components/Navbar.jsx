"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

// Add or remove links here, the navbar updates automatically.
// `auth: true` means the link only shows when the user is logged in.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Cart", href: "/cart", auth: true },
  { label: "Wishlist", href: "/wishlist", auth: true },
  { label: "Support", href: "/contact" },
];

const GUEST_LINKS = [
  {
    label: "Login",
    href: "/login",
    style: "text-gray-700 hover:text-indigo-600",
  },
  {
    label: "Register",
    href: "/register",
    style: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700",
  },
];

export default function Navbar() {
  const { user, logout, fetchMe } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // Close the mobile menu whenever the page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/login");
  };

  const visibleLinks = NAV_LINKS.filter((link) => !link.auth || user);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href) =>
    `transition-colors hover:text-indigo-600 ${
      isActive(href) ? "text-indigo-600" : "text-gray-700"
    }`;

  const firstName = user?.fullName?.split(" ")[0] || "Profile";
  const initial = firstName.charAt(0).toUpperCase();

  // Shows a number badge on Cart only if the user object has a cart array
  const cartCount = Array.isArray(user?.cart) ? user.cart.length : 0;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-600 tracking-tight"
        >
          Proton
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${linkClass(link.href)} relative`}
            >
              {link.label}
              {link.href === "/cart" && cartCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3 text-sm font-medium">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
              >
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                  {initial}
                </span>
                {firstName}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            GUEST_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${link.style}`}
              >
                {link.label}
              </Link>
            ))
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
            >
              {link.label}
              {link.href === "/cart" && cartCount > 0 && ` (${cartCount})`}
            </Link>
          ))}

          {user ? (
            <>
              <Link href="/profile" className={linkClass("/profile")}>
                Profile
              </Link>
              <button onClick={handleLogout} className="text-left text-red-600">
                Logout
              </button>
            </>
          ) : (
            GUEST_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))
          )}
        </div>
      )}
    </nav>
  );
}
