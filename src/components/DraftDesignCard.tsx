"use client";

import Image from "next/image";

export type DraftDesignStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "in_production"
  | "ready_for_pickup"
  | "claimed"
  | "cancelled"
  | "declined";

type Design = {
  id: string;
  preferred_sticker: string;
  description: string;
  design_image_url?: string | null;
  status: DraftDesignStatus;

  // optional (to align with preorder-like extensibility)
  keycap_color?: string;
  switch_color?: string;
  case_color?: string;
};

type Props = {
  design: Design;
  onView?: () => void;
  onSendRequest?: () => void;
};

export default function DraftDesignCard({
  design,
  onView,
  onSendRequest,
}: Props) {
  const imageSrc = design.design_image_url ?? "/logo.png";

  const statusColors: Record<DraftDesignStatus, string> = {
    draft: "bg-gray-500",
    pending: "bg-yellow-400",
    confirmed: "bg-blue-400",
    in_production: "bg-orange-400",
    ready_for_pickup: "bg-green-500",
    claimed: "bg-gray-700",
    cancelled: "bg-red-500",
    declined: "bg-red-700",
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 w-[400px] h-[510px] flex flex-col">

      {/* IMAGE */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={imageSrc}
          alt={design.preferred_sticker}
          fill
          className="object-cover transition duration-300"
        />
      </div>

      {/* STATUS BADGE */}
      <div
        className={`absolute top-3 right-3 px-3 py-1 text-xs text-white font-semibold rounded-md ${statusColors[design.status]} z-10`}
      >
        {design.status.replaceAll("_", " ")}
      </div>

      {/* INFO */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm text-gray-500 mb-1">
          Draft Design
        </p>

        <h3 className="font-bold text-lg mb-2">
          {design.preferred_sticker}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-3 mb-3">
          {design.description}
        </p>

        {/* ACTIONS */}
        <div className="mt-auto flex gap-2">
          {onView && (
            <button
              onClick={onView}
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 text-center font-medium hover:bg-gray-50 transition"
            >
              View
            </button>
          )}

          {onSendRequest && (
            <button
              onClick={onSendRequest}
              className="flex-1 px-4 py-3 rounded-md bg-[#7B8FA3] text-white font-medium hover:opacity-90 transition"
            >
              Send Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}