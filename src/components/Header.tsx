"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdminUser = user?.role === "admin";

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    if (dropdownOpen) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Site Name */}
            <Link href="/" className="flex items-center gap-3">
              <Image src="/brand.png" alt="Logo" width={60} height={60} />
              <span className="text-xl font-bold tracking-wide text-[#7B8FA3]">
                {isAdminUser ? "ADMIN PAGE" : "THE CLICKERS"}
              </span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* Regular nav links for non-admins */}
            {!isAdminUser && (
  <>
    <Link href="/" className="text-gray-700 hover:text-gray-900 transition">
      Home
    </Link>

    <Link href="/products" className="text-gray-700 hover:text-gray-900 transition">
      Products
    </Link>

    {/* ✅ NEW */}
    <Link href="/custom-design" className="text-gray-700 hover:text-gray-900 transition">
      Custom Stickers
    </Link>

    <Link href="/#about" className="text-gray-700 hover:text-gray-900 transition">
      About
    </Link>
  </>
)}

              {/* Auth / Avatar */}
              {loading ? (
                <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <div className="relative">
                  {/* Avatar button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen((prev) => !prev);
                    }}
                    className="flex items-center focus:outline-none rounded-full"
                  >
                    <img
                      src={user.user_metadata?.avatar_url || "/default-avatar.png"}
                      alt="avatar"
                      className="w-9 h-9 rounded-full border border-gray-200"
                    />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                    >
                      {/* Product Dashboard for admins */}
                      {isAdminUser && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Product Dashboard
                        </Link>
                      )}

                      {/* Links for everyone */}
                      <Link
                        href="/pre-orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Pre-ordered
                      </Link>
                      <Link
                        href="/designs"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Designs
                      </Link>

                      <div className="border-t border-gray-200" />

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="px-4 py-2 rounded-md text-white bg-[#7B8FA3] hover:opacity-90"
                >
                  Log in / Sign up
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}