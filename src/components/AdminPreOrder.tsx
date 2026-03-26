"use client";

import Image from "next/image";

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  price: number;
  image_url?: string | null;
};

export type PreOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_for_pick_up"
  | "claimed"
  | "cancelled"
  | "cancelled_admin";

type Props = {
  product: Product;
  status: PreOrderStatus;
  onStatusChange: (newStatus: PreOrderStatus) => void;
};

export default function AdminPreOrderCard({
  product,
  status,
  onStatusChange,
}: Props) {
  const imageSrc = product.image_url ?? "/logo.png";

  const statusColors: Record<PreOrderStatus, string> = {
    pending: "bg-yellow-400",
    confirmed: "bg-blue-400",
    processing: "bg-orange-400",
    ready_for_pick_up: "bg-green-500",
    claimed: "bg-gray-700",
    cancelled: "bg-red-400",
    cancelled_admin: "bg-red-600",
  };

  // 🔁 STATUS TRANSITIONS (your workflow logic)
  const getNextAction = () => {
    switch (status) {
      case "pending":
        return {
          label: "Accept Order",
          action: () => onStatusChange("confirmed"),
        };

      case "confirmed":
        return {
          label: "Start Production",
          action: () => onStatusChange("processing"),
        };

      case "processing":
        return {
          label: "Mark Ready",
          action: () => onStatusChange("ready_for_pick_up"),
        };

      case "ready_for_pick_up":
        return {
          label: "Mark as Claimed",
          action: () => onStatusChange("claimed"),
        };

      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <div className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 w-[400px] h-[560px] flex flex-col">
      
      {/* IMAGE */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* STATUS BADGE */}
      <div
        className={`absolute top-3 right-3 px-3 py-1 text-xs text-white font-semibold rounded-md ${
          statusColors[status]
        }`}
      >
        {status.replaceAll("_", " ")}
      </div>

      {/* INFO */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm text-gray-500 mb-1">
          {product.category ?? "Uncategorized"}
        </p>

        <h3 className="mb-2 font-bold">{product.name}</h3>

        <div className="mb-4 text-xl text-[#7B8FA3]">
          ₱{Number(product.price).toLocaleString()}
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-auto flex flex-col gap-2">
          {/* PRIMARY ACTION */}
          {nextAction && (
            <button
              onClick={nextAction.action}
              className="w-full bg-[#7B8FA3] text-white py-2 rounded-md hover:opacity-90"
            >
              {nextAction.label}
            </button>
          )}

          {/* CANCEL (only if still active) */}
          {!["claimed", "cancelled", "cancelled_admin"].includes(status) && (
            <button
              onClick={() => onStatusChange("cancelled_admin")}
              className="w-full border border-red-400 text-red-500 py-2 rounded-md hover:bg-red-50"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}