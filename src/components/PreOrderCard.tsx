"use client";

import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  price: number;
  image_url?: string | null;
  stock?: number | null;
};

// 🔹 Include all possible statuses
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
  onView?: () => void; // Optional callback for modal view
};

export default function PreOrderCard({ product, status, onView }: Props) {
  const imageSrc = product.image_url ?? "/logo.png";

  const statusColors: Record<PreOrderStatus, string> = {
    pending: "bg-yellow-400",
    confirmed: "bg-blue-400",
    processing: "bg-orange-400",
    ready_for_pick_up: "bg-green-500",
    claimed: "bg-gray-700",
    cancelled: "bg-red-500",
    cancelled_admin: "bg-red-700",
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 w-[400px] h-[510px] flex flex-col">
      
      {/* IMAGE */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover transition duration-300"
        />
      </div>

      {/* STATUS BADGE */}
      <div
        className={`absolute top-3 right-3 px-3 py-1 text-xs text-white font-semibold rounded-md ${statusColors[status]} z-10`}
      >
        {status.replaceAll("_", " ")}
      </div>

      {/* INFO */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm text-gray-500 mb-1">
          {product.category ?? "Uncategorized"}
        </p>

        <h3 className="mb-2 font-bold">{product.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl text-[#7B8FA3]">
            ₱{Number(product.price).toLocaleString()}
          </span>
        </div>

        {/* VIEW BUTTON */}
        <div className="mt-auto flex justify-center">
          {onView ? (
            <button
              onClick={onView}
              className="px-12 py-3 rounded-md border border-gray-300 text-center font-medium hover:bg-gray-50 transition"
            >
              View
            </button>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="px-12 py-3 rounded-md border border-gray-300 text-center font-medium hover:bg-gray-50 transition"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}