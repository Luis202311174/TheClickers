"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserPreOrders } from "@/utils/fetchPreOrders";
import PreOrderCard, { PreOrderStatus } from "@/components/PreOrderCard";
import KeycapViewer from "@/components/KeycapViewer";

type PreOrderProduct = {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  price: number;
  image_url?: string | null;
  offset_x?: number;
  offset_y?: number;
  scale?: number;
  is_preorder: boolean;
};

type PreOrder = {
  id: string;
  status: PreOrderStatus; // Use the unified type from PreOrderCard
  keycap_color: string;
  switch_color: string;
  case_color: string;
  total_price: number;
  products: PreOrderProduct;
};

export default function PreOrdersPage() {
  const { user, loading } = useAuth();
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PreOrder | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadPreOrders = async () => {
      const data = await fetchUserPreOrders(user.id);
      setPreOrders(data);
    };

    loadPreOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please log in to view your pre-orders.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {preOrders.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            You have no pre-orders yet.
          </p>
        )}

        {preOrders.map((order) => (
          <PreOrderCard
            key={order.id}
            product={order.products}
            status={order.status}
            onView={() => setSelectedOrder(order)}
          />
        ))}
      </div>

      <Footer />

      {/* 3D Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-xl font-bold"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedOrder.products.name}</h2>

            <KeycapViewer
              imageUrl={selectedOrder.products.image_url ?? "/logo.png"}
              offset={{
                x: selectedOrder.products.offset_x ?? 0,
                y: selectedOrder.products.offset_y ?? 0,
              }}
              scale={selectedOrder.products.scale ?? 1}
              keycapColor={selectedOrder.keycap_color}
              switchColor={selectedOrder.switch_color}
              switchCasingColor={selectedOrder.case_color}
            />
          </div>
        </div>
      )}
    </div>
  );
}