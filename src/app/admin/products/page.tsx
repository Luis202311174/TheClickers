"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Header from "@/components/Header";
import AdminSidebar from "@/components/AdminSidebar";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_preorder: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseAdmin
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ✅ Fixed Sidebar */}
      <AdminSidebar />

      {/* ✅ Right side */}
      <div className="flex-1 flex flex-col ml-64">
        {/* ✅ Sticky Header */}
        <Header />

        {/* ✅ Scrollable Content */}
        <main className="flex-1 overflow-auto p-8">
          <h1 className="text-3xl font-bold text-[#7B8FA3] mb-6">
            Products
          </h1>

          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col"
                >
                  <img
                    src={product.image_url || "/default-product.png"}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />

                  <h2 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h2>

                  <p className="text-sm text-gray-500 mb-1">
                    {product.category}
                  </p>

                  <p className="text-[#7B8FA3] font-bold mb-2">
                    ₱{product.price}
                  </p>

                  {product.is_preorder && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full w-fit">
                      Pre-order
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}