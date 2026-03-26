"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProductBySlug } from "@/utils/fetchProductBySlug";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LivePreviewPanel from "@/components/LivePreviewPanel";

export default function ProductPage() {
  const { slug } = useParams();

  // ✅ PRODUCT STATE (you missed this)
  const [product, setProduct] = useState<any>(null);

  // ✅ USER-CUSTOMIZABLE COLORS
  const [colors, setColors] = useState({
    keycap: "#ffffff",
    switch: "#e30000",
    casing: "#ffffff",
  });

  // ✅ FETCH PRODUCT
  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      const data = await fetchProductBySlug(slug as string);
      setProduct(data);
    };

    load();
  }, [slug]);

  // ✅ SYNC COLORS AFTER PRODUCT LOADS
  useEffect(() => {
    if (!product) return;

    setColors({
      keycap: product.keycap_color || "#ffffff",
      switch: product.switch_color || "#e30000",
      casing: product.switch_casing_color || "#ffffff",
    });
  }, [product]);

  // ✅ LOADING STATE
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
    <Header />

    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* LEFT */}
      <div className="w-full">
        <LivePreviewPanel
          previewUrl={product.image_url}
          offset={{
            x: product.offset_x || 0,
            y: product.offset_y || 0,
          }}
          scale={product.scale || 1}
          colors={colors}
          setOffset={() => {}}
          setScale={() => {}}
          setColors={setColors}
          showSliders={false}
          showReset={false}
        />
      </div>

      {/* RIGHT */}
      <div className="w-full">
        <div className="bg-white rounded-xl shadow p-6 h-full">
          <p className="text-sm text-gray-500">{product.category}</p>

          <h1 className="text-3xl text-[#7B8FA3]">
            {product.name}
          </h1>

          <p className="text-2xl mt-2">
            ${product.price}
          </p>

          <p className="text-gray-600 mt-4">
            {product.description}
          </p>

          <button className="mt-6 w-full bg-[#7B8FA3] text-white py-3 rounded-lg hover:opacity-90">
            Pre-order
          </button>
        </div>
      </div>

    </div>

    <Footer />
  </div>
  );
}