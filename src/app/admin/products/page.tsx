"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import KeycapViewer from "@/components/KeycapViewer";

export default function AdminProductsPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Accessories",
    isPreorder: true,
  });

  const router = useRouter();
    useEffect(() => {
    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
        router.push("/admin/login");
        return;
        }

        const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

        if (profile?.role !== "admin") {
        router.push("/admin/login");
        }
    };

    checkUser();
    }, []);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    setImageFile(file);

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleUpload = async () => {
    if (!imageFile) return null;

    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    try {
        setLoading(true);

        const imageUrl = await handleUpload();

        if (!imageUrl) {
        throw new Error("Image upload failed");
        }

        const { error } = await supabase.from("products").insert({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        is_preorder: form.isPreorder,
        image_url: imageUrl,
        offset_x: offset.x,
        offset_y: offset.y,
        scale: scale,
        });

        if (error) {
        console.error("Insert error:", error);
        throw error;
        }

        alert("Product added!");
      setImageFile(null);
      setPreviewUrl(null);
      setOffset({ x: 0, y: 0 });
      setScale(1);
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin - Add Product</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT - PREVIEW */}
        <div>
          <div className="border rounded-lg p-4">
            <KeycapViewer
              imageUrl={previewUrl || "/logo.png"}
              offset={offset}
              scale={scale}
            />
          </div>

          {/* CONTROLS */}
          <div className="mt-4 space-y-3">
            <label className="text-sm">Move X</label>
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

            <label className="text-sm">Move Y</label>
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

            <label className="text-sm">Scale</label>
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
        </div>

        {/* RIGHT - FORM */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full border p-2 rounded"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />

          <select
            className="w-full border p-2 rounded"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="Accessories">Accessories</option>
            <option value="Electronics">Electronics</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isPreorder}
              onChange={(e) => handleChange("isPreorder", e.target.checked)}
            />
            Pre-order item
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFileChange(e.target.files?.[0] || null)
            }
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}