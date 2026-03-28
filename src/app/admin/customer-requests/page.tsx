"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Header from "@/components/Header";
import { fetchCustomerDesigns } from "@/utils/fetchCustomerDesigns";
import CustomerDesignCard, {
  CustomerDesign,
  CustomerDesignStatus,
} from "@/components/CustomerDetailedList";

export default function AdminCustomerDesignsPage() {
  const [designs, setDesigns] = useState<CustomerDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ LOAD DESIGNS
  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchCustomerDesigns();

      setDesigns(data ?? []);
    } catch (err: unknown) {
      console.error("Fetch customer designs error:", err);
      setError("Failed to load customer designs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ UPDATE STATUS
  const updateStatus = async (
    id: string,
    status: CustomerDesignStatus
  ) => {
    try {
      setUpdatingId(id);

      const res = await fetch(`/api/admin/customer-designs/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update status");
      }

      // ✅ Optimistic update
      setDesigns((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, status } : d
        )
      );

      // 🔁 Uncomment if you want strict consistency
      // await load();

    } catch (err: unknown) {
      console.error("Update status error:", err);

      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
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
          <h1 className="text-3xl font-bold mb-6 text-[#7B8FA3]">
            Customer Designs
          </h1>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* CONTENT */}
          {loading ? (
            <p>Loading...</p>
          ) : designs.length === 0 ? (
            <p className="text-gray-500">No designs found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {designs.map((design) => (
                <CustomerDesignCard
                  key={design.id}
                  design={design}
                  onStatusChange={updateStatus}
                  isUpdating={updatingId === design.id}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}