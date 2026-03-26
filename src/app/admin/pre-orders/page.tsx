"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminSidebar from "@/components/AdminSidebar";
import Header from "@/components/Header";
import AdminPreOrderCard, {
  PreOrderStatus,
} from "@/components/AdminPreOrder";

// 🔹 Product type (needed for card)
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url?: string | null;
  category?: string | null;
}

// 🔹 PreOrder with joined product
interface PreOrder {
  id: string;
  status: PreOrderStatus;
  product: Product;
}

export default function AdminRequestsPage() {
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch with JOIN and safe product mapping
  const fetchPreOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseAdmin
        .from("pre_orders")
        .select(`
          id,
          status,
          product:products (
            id,
            name,
            slug,
            price,
            image_url,
            category
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map Supabase response to match PreOrder type with fallback
      const mapped: PreOrder[] = (data || []).map((item: any) => ({
        id: item.id,
        status: item.status,
        product: item.product?.[0] ?? {
          id: "unknown",
          name: "Deleted Product",
          slug: "deleted-product",
          price: 0,
          image_url: "/logo.png",
          category: null,
        },
      }));

      setPreOrders(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreOrders();
  }, []);

  // ✅ Update status (connected to card buttons)
  const updateStatus = async (id: string, newStatus: PreOrderStatus) => {
    try {
      const { error } = await supabaseAdmin
        .from("pre_orders")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // 🔥 Optimistic update
      setPreOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ✅ Fixed Sidebar */}
      <AdminSidebar />

      {/* ✅ Right side */}
      <div className="flex-1 flex flex-col ml-64">
        {/* ✅ Sticky Header */}
        <Header />

        {/* ✅ Scrollable content */}
        <main className="flex-1 overflow-auto p-8">
          <h1 className="text-3xl font-bold text-[#7B8FA3] mb-6">
            Pre-order Requests
          </h1>

          {loading ? (
            <p>Loading...</p>
          ) : preOrders.length === 0 ? (
            <p className="text-gray-500">No pre-orders found.</p>
          ) : (
            <div className="flex flex-wrap gap-6">
              {preOrders.map((order) => (
                <AdminPreOrderCard
                  key={order.id}
                  product={order.product}
                  status={order.status}
                  onStatusChange={(newStatus) =>
                    updateStatus(order.id, newStatus)
                  }
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}