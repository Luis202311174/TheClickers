"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProductBySlug } from "@/utils/fetchProductBySlug";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KeycapViewer from "@/components/KeycapViewer";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      const data = await fetchProductBySlug(slug as string);
      setProduct(data);
    };

    load();
  }, [slug]);

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

      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-10">

        {/* LEFT */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl mb-3 text-[#7B8FA3]">Preview</h2>

          <KeycapViewer
            imageUrl={product.image_url}
            offset={{
              x: product.offset_x || 0,
              y: product.offset_y || 0,
            }}
            scale={product.scale || 1}
          />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
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

            <button className="mt-6 w-full bg-[#7B8FA3] text-white py-3 rounded-lg">
              Pre-order
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}