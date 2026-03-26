"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Header from "@/components/Header";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
}

interface PreOrder {
  id: string;
  product_id: string;
  status: string;
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
        const { data: productsData } = await supabaseAdmin
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        const { data: ordersData } = await supabaseAdmin
          .from("order_items")
          .select("*")
          .order("created_at", { ascending: false });

        const { data: preOrdersData } = await supabaseAdmin
          .from("pre_orders")
          .select("*")
          .order("created_at", { ascending: false });

        setProducts(productsData || []);
        setOrders(ordersData || []);
        setPreOrders(preOrdersData || []);
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
      {/* Sidebar fixed */}
      <AdminSidebar />

      {/* Right content area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header sticky */}
        <Header />

        {/* Scrollable main content */}
        <main className="flex-1 overflow-auto p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Total Products</h2>
              <p className="text-2xl font-bold text-[#7B8FA3]">
                {loading ? "..." : products.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
              <p className="text-2xl font-bold text-[#7B8FA3]">
                {loading ? "..." : orders.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Pending Pre-orders</h2>
              <p className="text-2xl font-bold text-[#7B8FA3]">
                {loading
                  ? "..."
                  : preOrders.filter((po) => po.status === "pending").length}
              </p>
            </div>
          </div>

          {/* Latest entries preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold mb-2">Latest Products</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {loading
                  ? <li>Loading...</li>
                  : products.slice(0, 5).map((p) => (
                      <li key={p.id}>{p.name} - ${p.price}</li>
                    ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold mb-2">Latest Orders</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {loading
                  ? <li>Loading...</li>
                  : orders.slice(0, 5).map((o) => (
                      <li key={o.id}>Order ID: {o.id} - Qty: {o.quantity}</li>
                    ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-md font-semibold mb-2">Latest Pre-orders</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {loading
                  ? <li>Loading...</li>
                  : preOrders.slice(0, 5).map((po) => (
                      <li key={po.id}>
                        PreOrder ID: {po.id} - Status: {po.status}
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}