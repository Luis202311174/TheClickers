"use client";

import KeycapViewer from "@/components/KeycapViewer";
import { HelpCircle } from "lucide-react";

type ColorState = {
  keycap: string;
  switch: string;
  casing: string;
};

type OffsetState = { x: number; y: number };

type Props = {
  previewUrl: string | null;
  offset: OffsetState;
  scale: number;

  colors: ColorState;

  setOffset: React.Dispatch<React.SetStateAction<OffsetState>>;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  setColors: React.Dispatch<React.SetStateAction<ColorState>>;

  isAdmin?: boolean;
  showSliders?: boolean;
  showReset?: boolean;
};

const KEYCAP_PRESETS = [
  "#ff8400",
  "#000000",
  "#00a0eb",
  "#ffffff",
  "#61009e",
];

const SWITCH_PRESETS = ["#e30000", "#9e5400", "#00a0eb"];

export default function LivePreviewPanel({
  previewUrl,
  offset,
  scale,
  colors,
  setOffset,
  setScale,
  setColors,
  isAdmin = false,
  showSliders = true,
  showReset = true,
}: Props) {
  const safeX = offset?.x ?? 0;
  const safeY = offset?.y ?? 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">

          {/* Help tooltip */}
          <div className="relative group">
            <button className="p-2 border rounded-full hover:bg-gray-100 transition">
              <HelpCircle className="w-4 h-4 text-gray-600" />
            </button>

            <div className="absolute left-0 mt-2 w-56 bg-black text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
              <p className="font-semibold mb-1">Controls</p>
              <ul className="space-y-1">
                <li>Drag: Rotate</li>
                <li>Ctrl + Drag: Pan</li>
                <li>Scroll: Zoom</li>
              </ul>
            </div>
          </div>

          <h2 className="text-lg font-medium">
            Live Preview
            {isAdmin && (
              <span className="ml-2 text-sm text-gray-500 italic">
                (Admin view)
              </span>
            )}
          </h2>

        </div>
      </div>

      {/* Viewer */}
      <div className="border rounded-lg overflow-hidden">
        <KeycapViewer
          imageUrl={previewUrl || "/logo.png"}
          offset={offset}
          scale={scale}
          keycapColor={colors.keycap}
          switchColor={colors.switch}
          switchCasingColor={colors.casing}
        />
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-4 select-none">

        {/* Keycap */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">
            Keycap Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {KEYCAP_PRESETS.map((color) => (
              <button
                key={color}
                onClick={() =>
                  setColors((prev) => ({ ...prev, keycap: color }))
                }
                className={`w-8 h-8 rounded-full border-2 transition ${
                  colors.keycap === color
                    ? "border-black scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Switch */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">
            Switch Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {SWITCH_PRESETS.map((color) => (
              <button
                key={color}
                onClick={() =>
                  setColors((prev) => ({ ...prev, switch: color }))
                }
                className={`w-8 h-8 rounded-full border-2 transition ${
                  colors.switch === color
                    ? "border-black scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Casing */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">
            Case Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {KEYCAP_PRESETS.map((color) => (
              <button
                key={color}
                onClick={() =>
                  setColors((prev) => ({ ...prev, casing: color }))
                }
                className={`w-8 h-8 rounded-full border-2 transition ${
                  colors.casing === color
                    ? "border-black scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}