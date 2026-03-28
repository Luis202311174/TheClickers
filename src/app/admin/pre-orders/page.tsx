"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Header from "@/components/Header";
import DetailedListLay, { PreOrderStatus } from "@/components/DetailedList";
import type { PreOrder } from "@/utils/fetchPreOrdersAdmin";
import { fetchPreOrdersAdmin } from "@/utils/fetchPreOrdersAdmin";

export default function AdminRequestsPage() {
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ✅ Load data
  const loadPreOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchPreOrdersAdmin();
      setPreOrders(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreOrders();
  }, []);

  // ✅ FIXED updateStatus
  const updateStatus = async (id: string, newStatus: PreOrderStatus) => {
    try {
      setUpdatingId(id);

      const res = await fetch(`/api/admin/pre-orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // ✅ Optimistic UI update
      setPreOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );

      // 🔥 OPTIONAL: ensure sync with DB (safer for demos)
      // await loadPreOrders();

    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col ml-64">
        <Header />

        <main className="flex-1 overflow-auto p-8">
          <h1 className="text-3xl font-bold text-[#7B8FA3] mb-6">
            Pre-order Requests
          </h1>

          {loading ? (
            <p>Loading...</p>
          ) : preOrders.length === 0 ? (
            <p className="text-gray-500">No pre-orders found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {preOrders.map((order) => (
                <DetailedListLay
                  key={order.id}
                  order={order}
                  onStatusChange={updateStatus}
                  isUpdating={updatingId === order.id} // ✅ optional UX
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}