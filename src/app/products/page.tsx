"use client";

import { useState } from "react";
import Image from "next/image";
import ProductFilters from "@/components/ProductFilters";
import { ShoppingCart, Heart, Search, Filter } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = ["All", "Electronics", "Accessories"];

  // 🚨 Replace this later with Supabase fetch
  const products: any[] = [];

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ✅ Reusable Header */}
      <Header />

      {/* Page Title */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl text-[#7B8FA3] mb-4">
            Browse Our Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our collection and pre-order your favorites
          </p>
        </div>
      </section>

      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        />

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 flex-1">

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative aspect-square bg-gray-100">

                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />

                  {/* Favorite */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(product.id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                </div>

                <div className="p-4">
                  <h3 className="mb-2">{product.name}</h3>
                  <p className="text-[#7B8FA3] text-xl">
                    ₱{product.price}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 border py-2 rounded-md hover:bg-gray-50">
                      View
                    </button>
                    <button className="flex-1 bg-[#7B8FA3] text-white py-2 rounded-md hover:opacity-90">
                      Pre-Order
                    </button>
                  </div>
                </div>

              </div>
            ))}

          </div>
        )}

      </section>

      {/* ✅ Reusable Footer */}
      <Footer />

    </div>
  );
}