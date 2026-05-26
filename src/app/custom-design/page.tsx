"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import LivePreviewPanel from "@/components/LivePreviewPanel";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CustomerDesignPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [form, setForm] = useState({
    key_name: "",
    description: "",
  });

  const [colors, setColors] = useState({
    keycap: "#ffffff",
    switch: "#e30000",
    casing: "#ffffff",
  });

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.key_name.trim()) return "Key name is required";
    if (!form.description.trim()) return "Description is required";
    return null;
  };

  const submitDesign = async () => {
    const errorMsg = validateForm();

    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase.from("customer_designs").insert({
        user_id: user.id,
        key_name: form.key_name,
        description: form.description,
        keycap_color: colors.keycap,
        switch_color: colors.switch,
        case_color: colors.casing,
        offset_x: offset.x,
        offset_y: offset.y,
        scale: scale,
      });

      if (error) throw error;

      alert("Design request sent!");

      router.push("/my-designs");
    } catch (err: any) {
      console.error("FULL ERROR:", err);
      console.error("MESSAGE:", err?.message);
      console.error("DETAIL:", err?.details);
      console.error("HINT:", err?.hint);

      alert(err?.message || "Error submitting design");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    form.key_name.trim() && form.description.trim();

  if (loading) {
    return <div className="p-8">Checking authentication...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <h2 className="text-2xl font-semibold text-[#7B8FA3] mb-4">
            Please log in to continue
          </h2>
          <p className="text-gray-500">
            Use the login button at the top right.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="p-8">
        <section className="bg-white p-6 rounded-lg shadow mb-8">
          <h1 className="text-3xl font-bold text-[#7B8FA3]">
            Create Your Custom Design
          </h1>
          <p className="text-gray-600">
            Customize your design and submit your request
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Preview */}
          <LivePreviewPanel
            previewUrl={null}
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

            <textarea
              placeholder="Description"
              className="w-full border p-3 rounded-md"
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
            />

            {/* Single Action */}
            <button
              onClick={submitDesign}
              disabled={submitting || !isFormValid}
              className="w-full bg-[#7B8FA3] text-white py-3 rounded-lg disabled:opacity-50"
            >
              Send Design Request
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}