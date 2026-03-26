"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const { user, logout, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image src="/brand.png" alt="Logo" width={60} height={60} />
              <span className="text-xl font-bold tracking-wide text-[#7B8FA3]">
                {isAdmin ? "ADMIN PAGE" : "THE CLICKERS"}
              </span>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {isAdmin ? (
                <>
                  <a
                    href="/admin/add-products"
                    className="text-gray-700 hover:text-gray-900 transition"
                  >
                    Add Product
                  </a>
                  <a
                    href="/admin/products"
                    className="text-gray-700 hover:text-gray-900 transition"
                  >
                    Manage Products
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="#home"
                    className="text-gray-700 hover:text-gray-900 transition"
                  >
                    Home
                  </a>
                  <a
                    href="#products"
                    className="text-gray-700 hover:text-gray-900 transition"
                  >
                    Products
                  </a>
                  <a
                    href="#about"
                    className="text-gray-700 hover:text-gray-900 transition"
                  >
                    About
                  </a>

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
                          <a
                            href="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Pre-ordered
                          </a>
                          <a
                            href="/designs"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            My Designs
                          </a>
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
                </>
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