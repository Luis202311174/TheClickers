"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Header from "@/components/Header";

interface Product {
  id: string;
  name: string;
  price: number;
  created_at?: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
}

interface PreOrder {
  id: string;
  product_id: string | null;
  status: string;
  created_at?: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/admin/dashboard");

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await res.json();

        setProducts(data.products || []);
        setOrders(data.orders || []);
        setPreOrders(data.preOrders || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col ml-64">
        <Header />

        <main className="flex-1 overflow-auto p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Admin Dashboard
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Total Products</h2>
              <p className="text-2xl font-bold text-[#7B8FA3]">
                {loading ? "..." : products.length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">
                Total Order Items
              </h2>
              <p className="text-2xl font-bold text-[#7B8FA3]">
                {loading ? "..." : orders.length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">
                Pending Pre-orders
              </h2>
              <p className="text-2xl font-bold text-[#7B8FA3]">
                {loading
                  ? "..."
                  : preOrders.filter((po) => po.status === "pending").length}
              </p>
            </div>
          </div>

          {/* Latest previews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Products */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold mb-2">
                Latest Products
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {loading ? (
                  <li>Loading...</li>
                ) : products.length === 0 ? (
                  <li className="text-gray-400">No products found</li>
                ) : (
                  products.slice(0, 5).map((p) => (
                    <li key={p.id}>
                      {p.name} - ${p.price}
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Order Items */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold mb-2">
                Latest Order Items
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {loading ? (
                  <li>Loading...</li>
                ) : orders.length === 0 ? (
                  <li className="text-gray-400">No order items found</li>
                ) : (
                  orders.slice(0, 5).map((o) => (
                    <li key={o.id}>
                      Product: {o.product_id} — Qty: {o.quantity}
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Pre-orders */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold mb-2">
                Latest Pre-orders
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {loading ? (
                  <li>Loading...</li>
                ) : preOrders.length === 0 ? (
                  <li className="text-gray-400">No pre-orders found</li>
                ) : (
                  preOrders.slice(0, 5).map((po) => (
                    <li key={po.id}>
                      PreOrder ID: {po.id} — Status: {po.status}
                    </li>
                  ))
                )}
              </ul>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}