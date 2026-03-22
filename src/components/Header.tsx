"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
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

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            
            {isAdmin ? (
              <>
                <a href="/admin/add-products" className="text-gray-700 hover:text-gray-900 transition">
                  Add Product
                </a>
                <a href="/admin/products" className="text-gray-700 hover:text-gray-900 transition">
                  Manage Products
                </a>
              </>
            ) : (
              <>
                <a href="#home" className="text-gray-700 hover:text-gray-900 transition">
                  Home
                </a>
                <a href="#products" className="text-gray-700 hover:text-gray-900 transition">
                  Products
                </a>
                <a href="#about" className="text-gray-700 hover:text-gray-900 transition">
                  About
                </a>

                <button className="px-4 py-2 rounded-md text-white bg-[#7B8FA3] hover:opacity-90">
                  Pre-Order Now
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}