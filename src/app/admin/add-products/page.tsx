"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import AdminSidebar from "@/components/AdminSidebar";
import LivePreviewPanel from "@/components/LivePreviewPanel";

// ✅ Client-safe Supabase instance (anon key only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

  // ✅ Admin check (client-safe)
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return router.push("/admin/login");

      const { data: profile, error } = await supabase
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

  // Cleanup preview URL
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

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  // ✅ Upload + insert handled via API route
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!imageFile) throw new Error("No image selected");

      const slug = generateSlug(form.name);

      const fileName = `${Date.now()}-${imageFile.name}`;

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("fileName", fileName);

      formData.append(
        "payload",
        JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          offset_x: offset.x,
          offset_y: offset.y,
          scale,
          slug,
        })
      );

      const res = await fetch("/api/admin/add-products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create product");

      alert("Product added!");

      // reset state
      setImageFile(null);
      setPreviewUrl(null);
      setOffset({ x: 0, y: 0 });
      setScale(1);
      setForm({
        name: "",
        description: "",
        price: "",
        category: "Accessories",
        isPreorder: true,
      });
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col ml-64">
        <Header />

        <main className="flex-1 overflow-auto p-8">
          <section className="bg-white py-6 px-6 rounded-lg shadow mb-8">
            <h1 className="text-3xl font-bold text-[#7B8FA3] mb-2">
              Add New Product
            </h1>
            <p className="text-gray-600">
              Create and customize your keycap design
            </p>
          </section>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Live preview */}
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

            {/* Form */}
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
                  onChange={(e) =>
                    handleChange("isPreorder", e.target.checked)
                  }
                />
                Pre-order item
              </label>

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

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#7B8FA3] text-white py-3 rounded-lg hover:opacity-90"
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}