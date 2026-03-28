"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import LivePreviewPanel from "@/components/LivePreviewPanel";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CustomerDesignPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState({
    key_name: "",
    sticker_name: "",
    description: "",
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

  // Auth
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return router.push("/login");
      setUser(user);
    };

    init();
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

  // ✅ Validation
  const validateForm = () => {
    if (!form.key_name.trim()) return "Key name is required";
    if (!form.sticker_name.trim()) return "Sticker name is required";
    if (!form.description.trim()) return "Description is required";
    if (!imageFile) return "Design image is required";
    return null;
  };

  const handleUpload = async () => {
    if (!imageFile) return null;

    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error } = await supabase.storage
      .from("design-images")
      .upload(fileName, imageFile);

    if (error) {
      console.error(error);
      return null;
    }

    const { data } = supabase.storage
      .from("design-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const submitDesign = async (status: "draft" | "pending") => {
    const errorMsg = validateForm();

    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await handleUpload();

      if (!imageUrl) throw new Error("Image upload failed");

      const { error } = await supabase.from("customer_designs").insert({
        user_id: user.id,
        preferred_sticker: form.sticker_name,
        description: form.description,
        design_image_url: imageUrl,
        keycap_color: colors.keycap,
        switch_color: colors.switch,
        case_color: colors.casing,
        offset_x: offset.x,
        offset_y: offset.y,
        scale: scale,
        status: status,
      });

      if (error) throw error;

      alert(
        status === "draft"
          ? "Design saved as draft!"
          : "Design request sent!"
      );

      router.push("/my-designs");
    } catch (err) {
      console.error(err);
      alert("Error submitting design");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Button enable state
  const isFormValid =
    form.key_name.trim() &&
    form.sticker_name.trim() &&
    form.description.trim() &&
    imageFile;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="p-8">
        <section className="bg-white p-6 rounded-lg shadow mb-8">
          <h1 className="text-3xl font-bold text-[#7B8FA3]">
            Create Your Custom Design
          </h1>
          <p className="text-gray-600">
            Customize your design and submit or save it
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Preview */}
          <LivePreviewPanel
            previewUrl={previewUrl}
            offset={offset}
            scale={scale}
            colors={colors}
            setOffset={setOffset}
            setScale={setScale}
            setColors={setColors}
            isAdmin={false}
          />

          {/* Form */}
          <div className="bg-white border rounded-lg p-6 space-y-5">
            <h2 className="text-lg font-medium">Design Details</h2>

            <input
              type="text"
              placeholder="Name of the Key"
              className="w-full border p-3 rounded-md"
              value={form.key_name}
              onChange={(e) =>
                handleChange("key_name", e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Sticker Name"
              className="w-full border p-3 rounded-md"
              value={form.sticker_name}
              onChange={(e) =>
                handleChange("sticker_name", e.target.value)
              }
            />

            <textarea
              placeholder="Description"
              className="w-full border p-3 rounded-md"
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
            />

            {/* Upload */}
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Upload Design
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e.target.files?.[0] || null)
                }
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => submitDesign("draft")}
                disabled={loading || !isFormValid}
                className="w-full bg-gray-400 text-white py-3 rounded-lg disabled:opacity-50"
              >
                Save Design
              </button>

              <button
                onClick={() => submitDesign("pending")}
                disabled={loading || !isFormValid}
                className="w-full bg-[#7B8FA3] text-white py-3 rounded-lg disabled:opacity-50"
              >
                Send Order / Request Design
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}