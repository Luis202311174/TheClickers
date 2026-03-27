"use client";

import { useEffect, useState } from "react";
import LivePreviewPanel from "@/components/LivePreviewPanel";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  previewUrl: string | null;
  keycapColor: string;
  switchColor: string;
  caseColor: string;
  offsetX: number;
  offsetY: number;
  scale: number;
};

export default function PreOrderPreviewModal({
  isOpen,
  onClose,
  previewUrl,
  keycapColor,
  switchColor,
  caseColor,
  offsetX,
  offsetY,
  scale,
}: Props) {
  const [offset, setOffset] = useState({ x: offsetX, y: offsetY });
  const [currScale, setScale] = useState(scale);

  useEffect(() => {
    if (isOpen) {
      setOffset({ x: offsetX, y: offsetY });
      setScale(scale);
    }
  }, [isOpen, offsetX, offsetY, scale]);

  if (!isOpen) return null;

  // Download handler
  const handleDownload = async () => {
    if (!previewUrl) return;
    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "preorder_preview.png"; // filename
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading image:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-w-full p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">Pre-order Preview</h2>

        <LivePreviewPanel
          previewUrl={previewUrl}
          offset={offset}
          scale={currScale}
          colors={{
            keycap: keycapColor,
            switch: switchColor,
            casing: caseColor,
          }}
          setOffset={() => {}}
          setScale={() => {}}
          setColors={() => {}}
          showSliders={false}
          showReset={false}
          isAdmin={false}
          hideUnusedPresets
        />

        {/* Small preview thumbnail */}
        {previewUrl && (
          <div className="mt-4 flex justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 object-contain border border-gray-300 rounded-lg"
            />
          </div>
        )}

        {/* Download button */}
        {previewUrl && (
          <button
            onClick={handleDownload}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Download Image
          </button>
        )}
      </div>
    </div>
  );
}