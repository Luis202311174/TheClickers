"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import KeycapViewer from "@/components/KeycapViewer";
import Header from "@/components/Header";

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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleSubmit = async () => {
    try {
        setLoading(true);

        const imageUrl = await handleUpload();

        if (!imageUrl) {
        throw new Error("Image upload failed");
        }

        const slug = generateSlug(form.name);

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
          slug: slug,
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
    <div className="min-h-screen border border-gray-200">
      <Header />

      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 text-left">
          <h1 className="text-4xl font-bold text-[#7B8FA3] mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600">
            Create and customize your keycap design
          </p>
        </div>
      </section>

    {/* MAIN */}
    <div className="max-w-7xl mx-auto px-4 py-3 grid lg:grid-cols-2 gap-10">

      {/* LEFT - PREVIEW */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-medium mb-3">Live Preview</h2>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <KeycapViewer
            imageUrl={previewUrl || "/logo.png"}
            offset={offset}
            scale={scale}
          />
        </div>

        {/* SLIDERS */}
        <div className="mt-4 space-y-4">
          
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

          {/* RESET */}
          <button
            onClick={() => {
              setOffset({ x: 0, y: 0 });
              setScale(1);
            }}
            className="w-full border rounded-lg py-2 text-sm hover:bg-gray-50"
          >
            Reset Design
          </button>
        </div>
      </div>

      {/* RIGHT - FORM */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">

        <h2 className="text-lg font-medium">Product Details</h2>

        <input
          type="text"
          placeholder="Product Name"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#7B8FA3]"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#7B8FA3]"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#7B8FA3]"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />

        <select
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#7B8FA3]"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="Accessories">Accessories</option>
          <option value="Electronics">Electronics</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPreorder}
            onChange={(e) => handleChange("isPreorder", e.target.checked)}
          />
          Pre-order item
        </label>

        {/* FILE UPLOAD */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Upload Design</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFileChange(e.target.files?.[0] || null)
            }
          />

          {imageFile && (
            <p className="text-xs text-gray-500 mt-1">
              {imageFile.name}
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#7B8FA3] text-white py-3 rounded-lg hover:opacity-90"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>
    </div>
  </div>
  );
}