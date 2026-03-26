"use client";

import KeycapViewer from "@/components/KeycapViewer";
import { HelpCircle } from "lucide-react";

type Props = {
  previewUrl: string | null;
  offset: { x: number; y: number };
  scale: number;
  colors: {
    keycap: string;
    switch: string;
    casing: string;
  };
  setOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  setColors: React.Dispatch<
    React.SetStateAction<{
      keycap: string;
      switch: string;
      casing: string;
    }>
  >;

  isAdmin?: boolean;
  showSliders?: boolean;
  showReset?: boolean;
};

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
  const KEYCAP_PRESETS = [
    { name: "Orange", value: "#ff8400" },
    { name: "Black", value: "#000000" },
    { name: "Blue", value: "#00a0eb" },
    { name: "White", value: "#ffffff" },
    { name: "Purple", value: "#61009e" },
  ];

  const SWITCH_PRESETS = [
    { name: "Red", value: "#e30000" },
    { name: "Brown", value: "#9e5400" },
    { name: "Blue", value: "#00a0eb" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 mb-1">
        {/* HELP */}
        <div className="relative group">
            <button
            type="button"
            className="bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 transition"
            >
            <HelpCircle className="w-4 h-4 text-gray-600" />
            </button>

            <div className="absolute left-0 mt-2 w-56 bg-black text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
            <p className="font-semibold mb-1">Controls for Live Preview:</p>
            <ul className="space-y-1">
                <li>Left Click</li>
                <li className="ml-4">Drag: Rotate</li>
                <li className="ml-4">Ctrl + Drag: Pan</li>
                <li className="mt-1">Scroll: Zoom</li>
            </ul>
            </div>
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-medium">
            Live Preview
            {isAdmin && (
                <span className="ml-2 text-sm font-normal italic text-gray-500">
                (The colors will not be uploaded, it will be customized by the users)
                </span>
            )}
            </h2>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden relative group">
        <KeycapViewer
          imageUrl={previewUrl || "/logo.png"}
          offset={offset}
          scale={scale}
          keycapColor={colors.keycap}
          switchColor={colors.switch}
          switchCasingColor={colors.casing}
        />
      </div>

      <div
        className="mt-4 space-y-4 select-none"
        onContextMenu={(e) => e.preventDefault()}
      >

        {/* KEYCAP COLOR */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">
            Keycap Color
          </label>

          <div className="flex gap-2 flex-wrap">
            {KEYCAP_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() =>
                  setColors((prev) => ({ ...prev, keycap: preset.value }))
                }
                className={`w-8 h-8 rounded-full border-2 ${
                  colors.keycap === preset.value
                    ? "border-black scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: preset.value }}
              />
            ))}
          </div>
        </div>

        {/* SWITCH */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">
            Switch Type
          </label>

          <div className="flex gap-2 flex-wrap">
            {SWITCH_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() =>
                  setColors((prev) => ({ ...prev, switch: preset.value }))
                }
                className={`w-8 h-8 rounded-full border-2 ${
                  colors.switch === preset.value
                    ? "border-black scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: preset.value }}
              />
            ))}
          </div>
        </div>

        {/* CASING */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">
            Casing Color
          </label>

          <div className="flex gap-2 flex-wrap">
            {KEYCAP_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() =>
                  setColors((prev) => ({ ...prev, casing: preset.value }))
                }
                className={`w-8 h-8 rounded-full border-2 ${
                  colors.casing === preset.value
                    ? "border-black scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: preset.value }}
              />
            ))}
          </div>
        </div>

        {showSliders && (
            <>
        {/* SLIDERS */}
        <div>
          <label className="text-sm text-gray-600">
            Move X ({offset.x.toFixed(2)})
          </label>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.01}
            value={offset.x}
            onChange={(e) =>
              setOffset((prev) => ({
                ...prev,
                x: parseFloat(e.target.value),
              }))
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Move Y ({offset.y.toFixed(2)})
          </label>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.01}
            value={offset.y}
            onChange={(e) =>
              setOffset((prev) => ({
                ...prev,
                y: parseFloat(e.target.value),
              }))
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Scale ({scale.toFixed(2)}x)
          </label>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.01}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        </>
        )}

        {showReset && (
            <button
                onClick={() => {
                setOffset({ x: 0, y: 0 });
                setScale(1);
                }}
                className="w-full border rounded-lg py-2 text-sm hover:bg-gray-50"
            >
                Reset Design
            </button>
            )}
      </div>
    </div>
  );
}