"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Header from "@/components/Header";
import LivePreviewPanel from "@/components/LivePreviewPanel";

export default function AdminProductsPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Accessories",
    isPreorder: true,
  });

  const [colors, setColors] = useState({
    keycap: "#ffffff",
    switch: "#e30000",
    casing: "#ffffff",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Admin-only session check
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabaseAdmin.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data: profile, error } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || profile?.role !== "admin") {
        router.push("/admin/login");
      }
    };

    checkAdmin();
  }, [router]);

  // ✅ Cleanup preview URL
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
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!imageFile) return null;

    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(fileName, imageFile);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const imageUrl = await handleUpload();
      if (!imageUrl) throw new Error("Image upload failed");

      const slug = generateSlug(form.name);

      const { error } = await supabaseAdmin.from("products").insert({
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
        keycap_color: colors.keycap,
        switch_color: colors.switch,
        switch_casing_color: colors.casing,
      });

      if (error) throw error;

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
          <p className="text-gray-600">Create and customize your keycap design</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-3 grid lg:grid-cols-2 gap-10">
        <LivePreviewPanel
          previewUrl={previewUrl}
          offset={offset}
          scale={scale}
          colors={colors}
          setOffset={setOffset}
          setScale={setScale}
          setColors={setColors}
          isAdmin={true}
        />

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
          <h2 className="text-lg font-medium">Product Details</h2>

          <input
            type="text"
            placeholder="Product Name"
            className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#7B8FA3]"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#7B8FA3]"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#7B8FA3]"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />

          <select
            className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#7B8FA3]"
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

          <div>
            <p className="text-sm text-gray-600 mb-1">Upload Design</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            {imageFile && <p className="text-xs text-gray-500 mt-1">{imageFile.name}</p>}
          </div>

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