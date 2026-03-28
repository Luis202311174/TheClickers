"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import CustomerDesignPreviewModal from "./CustomerDesignPreview";

export type CustomerDesignStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "in_production"
  | "ready_for_pickup"
  | "claimed"
  | "cancelled"
  | "declined";

type Product = {
  id: string;
  name: string;
  image_url?: string | null;
  offset_x?: number;
  offset_y?: number;
  scale?: number;
};

export type CustomerDesign = {
  id: string;
  user_id: string;
  product_id: string | null;

  status: CustomerDesignStatus;

  preferred_sticker?: string | null;
  description?: string | null;

  keycap_color: string;
  switch_color: string;
  case_color: string;

  design_image_url?: string | null;

  offset_x?: number;
  offset_y?: number;
  scale?: number;

  created_at?: string;
  updated_at?: string;

  product: Product | null;
};

type Props = {
  design: CustomerDesign;
  onStatusChange: (id: string, status: CustomerDesignStatus) => void;
  isUpdating?: boolean;
};

export default function CustomerDesignCard({
  design,
  onStatusChange,
  isUpdating,
}: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);

  // ✅ SAFE PRODUCT FALLBACK (handles null product_id)
  const product = design.product ?? {
    id: "",
    name: "Custom Design",
    image_url: "/logo.png",
  };

  const statusColors: Record<CustomerDesignStatus, string> = {
    draft: "bg-gray-400",
    pending: "bg-yellow-400",
    confirmed: "bg-blue-400",
    in_production: "bg-orange-400",
    ready_for_pickup: "bg-green-500",
    claimed: "bg-gray-700",
    cancelled: "bg-red-400",
    declined: "bg-red-600",
  };

  // ✅ SUPPORT MULTIPLE ACTIONS (Accept + Decline)
  const getActions = (): { label: string; value: CustomerDesignStatus }[] => {
    switch (design.status) {
      case "pending":
        return [
          { label: "Accept", value: "confirmed" },
          { label: "Decline", value: "declined" },
        ];
      case "confirmed":
        return [{ label: "Start Production", value: "in_production" }];
      case "in_production":
        return [{ label: "Ready for Pickup", value: "ready_for_pickup" }];
      case "ready_for_pickup":
        return [{ label: "Mark Claimed", value: "claimed" }];
      default:
        return [];
    }
  };

  const actions = getActions();

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition"
      >
        {/* IMAGE */}
        <div
          className="relative w-28 h-28 cursor-pointer"
          onClick={() => setPreviewOpen(true)}
        >
          <Image
            src={product.image_url || "/logo.png"}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col justify-between gap-2">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{product.name}</h2>

            {actions.length > 0 && (
              <div className="flex gap-2">
                {actions.map((action) => (
                  <button
                    key={action.value}
                    disabled={isUpdating}
                    onClick={() =>
                      onStatusChange(design.id, action.value)
                    }
                    className={`px-3 py-1 rounded-md text-xs text-white disabled:opacity-50 ${
                      action.value === "declined"
                        ? "bg-red-500"
                        : "bg-[#7B8FA3]"
                    }`}
                  >
                    {isUpdating ? "Updating..." : action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESCRIPTION (NEW) */}
          {design.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {design.description}
            </p>
          )}

          {/* STICKER (NEW) */}
          {design.preferred_sticker && (
            <span className="text-xs text-purple-500">
              Sticker: {design.preferred_sticker}
            </span>
          )}

          {/* COLORS */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              Keycap: {design.keycap_color}
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              Switch: {design.switch_color}
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              Case: {design.case_color}
            </span>
          </div>

          {/* STATUS */}
          <div className="flex justify-between items-center">
            <span
              className={`px-2 py-1 text-white text-xs rounded-md ${
                statusColors[design.status]
              }`}
            >
              {design.status.replaceAll("_", " ")}
            </span>

            <span className="text-gray-500 text-xs">
              User: {design.user_id}
            </span>
          </div>
        </div>
      </motion.div>

      {/* PREVIEW MODAL */}
      <CustomerDesignPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        previewUrl={design.design_image_url || product.image_url || null}
        keycapColor={design.keycap_color}
        switchColor={design.switch_color}
        caseColor={design.case_color}
        offsetX={design.offset_x || 0}
        offsetY={design.offset_y || 0}
        scale={design.scale || 1}
      />
    </>
  );
}