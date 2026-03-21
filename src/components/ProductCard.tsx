"use client";

import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  price: number;
  image_url?: string | null;
  is_preorder: boolean;
  stock?: number | null;
};

type Props = {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart?: (productId: string) => void;
  onView?: (productId: string) => void;
};

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onView,
}: Props) {
  const imageSrc = product.image_url || "/logo.png";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 w-[400px] h-[510px] flex flex-col">

      {/* IMAGE */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition duration-300"
        />

        {/* Preorder Badge */}
        {product.is_preorder && (
          <div className="absolute top-3 left-3 px-2 py-1 text-xs text-white rounded-md bg-[#7B8FA3]">
            Pre-Order
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Hover Actions */}
        <div
          className="
            absolute bottom-0 left-0 right-0 p-4 
            bg-gradient-to-t from-black/60 to-transparent 
            opacity-0 group-hover:opacity-100 transition
          "
        >
          <button
            onClick={() => onAddToCart?.(product.id)}
            className="w-full flex items-center justify-center gap-2 text-white py-2 rounded-md bg-[#7B8FA3] hover:opacity-90"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* INFO */}
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">
          {product.category || "Uncategorized"}
        </p>

        <h3 className="mb-2 font-bold">{product.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl text-[#7B8FA3]">
            ₱{Number(product.price).toLocaleString()}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onView?.(product.id)}
            className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-50"
          >
            View
          </button>

          <button
            onClick={() => onAddToCart?.(product.id)}
            className="flex-1 bg-[#7B8FA3] text-white py-2 rounded-md hover:opacity-90"
          >
            {product.is_preorder ? "Pre-Order" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}