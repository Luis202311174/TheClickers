"use client";

import { useEffect, useState } from "react";
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
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products");

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingIds((prev) => [...prev, id]);

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      // Optimistic UI update
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    } finally {
      setDeletingIds((prev) => prev.filter((pid) => pid !== id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col ml-64">
        <Header />

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
                  className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col relative"
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

                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingIds.includes(product.id)}
                    className={`mt-3 w-full py-1 text-white rounded-lg text-sm ${
                      deletingIds.includes(product.id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    } transition`}
                  >
                    {deletingIds.includes(product.id)
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}