"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export type PreOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_for_pick_up"
  | "claimed"
  | "cancelled"
  | "cancelled_admin";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
};

type PreOrder = {
  id: string;
  user_id: string;
  status: PreOrderStatus;
  keycap_color: string;
  switch_color: string;
  case_color: string;
  quantity: number;
  total_price: number;
  product: Product;
};

type Props = {
  order: PreOrder;
  onStatusChange: (id: string, status: PreOrderStatus) => void;
};

export default function DetailedList({ order, onStatusChange }: Props) {
  const product: Product = order.product || {
    id: "",
    name: "Unknown Product",
    price: 0,
    image_url: "/logo.png",
  };

  const statusColors: Record<PreOrderStatus, string> = {
    pending: "bg-yellow-400",
    confirmed: "bg-blue-400",
    processing: "bg-orange-400",
    ready_for_pick_up: "bg-green-500",
    claimed: "bg-gray-700",
    cancelled: "bg-red-400",
    cancelled_admin: "bg-red-600",
  };

  const getNextAction = () => {
    switch (order.status) {
      case "pending":
        return { label: "Accept", value: "confirmed" };
      case "confirmed":
        return { label: "Start Production", value: "processing" };
      case "processing":
        return { label: "Ready for Pickup", value: "ready_for_pick_up" };
      case "ready_for_pick_up":
        return { label: "Mark Claimed", value: "claimed" };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
    >
      {/* IMAGE */}
      <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.image_url || "/logo.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col justify-between gap-2">
        {/* PRODUCT NAME + ACTION */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{product.name}</h2>
          {nextAction && (
            <button
              onClick={() =>
                onStatusChange(order.id, nextAction.value as PreOrderStatus)
              }
              className="bg-[#7B8FA3] text-white px-3 py-1 rounded-md text-xs hover:opacity-90 transition"
            >
              {nextAction.label}
            </button>
          )}
        </div>

        {/* COLORS + STATUS + CANCEL */}
        <div className="flex items-center justify-between flex-wrap text-xs">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              Keycap: {order.keycap_color}
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              Switch: {order.switch_color}
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              Case: {order.case_color}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-white rounded-md text-xs ${statusColors[order.status]}`}
            >
              {order.status.replaceAll("_", " ")}
            </span>
            {!["claimed", "cancelled", "cancelled_admin"].includes(order.status) && (
              <button
                onClick={() => onStatusChange(order.id, "cancelled_admin")}
                className="text-red-500 border border-red-400 px-3 py-1 rounded-md text-xs hover:bg-red-50 transition"
              >
                Cancel Pre-order
              </button>
            )}
          </div>
        </div>

        {/* USER */}
        <div className="text-gray-500 text-xs">
          Pre-ordered by: {order.user_id}
        </div>
      </div>
    </motion.div>
  );
}