"use client";

import KeycapViewer from "@/components/KeycapViewer";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import DraftDesignCard, { DraftDesignStatus } from "@/components/DraftDesignCard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Design = {
  id: string;
  preferred_sticker: string;
  description: string;
  design_image_url: string | null;
  status: DraftDesignStatus;
  created_at: string;

  keycap_color?: string;
  switch_color?: string;
  case_color?: string;
  offset_x?: number;
  offset_y?: number;
  scale?: number;
};

export default function MyDraftDesignsPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  // ✅ Auth
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
    };

    init();
  }, [router]);

  // ✅ Fetch ALL designs (not just drafts)
  useEffect(() => {
    if (!user) return;

    const fetchDesigns = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("customer_designs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setDesigns(data || []);
      }

      setLoading(false);
    };

    fetchDesigns();
  }, [user]);

  // ✅ Send request (draft → pending)
  const sendRequest = async (id: string) => {
    const { error } = await supabase
      .from("customer_designs")
      .update({ status: "pending" })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to send request");
      return;
    }

    alert("Design sent for review!");

    // Optimistically update UI instead of removing
    setDesigns((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: "pending" } : d
      )
    );
  };

  const handleView = (design: Design) => {
    setSelectedDesign(design);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {designs.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No designs found.
          </p>
        )}

        {designs.map((design) => (
          <DraftDesignCard
            key={design.id}
            design={design}
            onView={() => handleView(design)}
            onSendRequest={
              design.status === "draft"
                ? () => sendRequest(design.id)
                : undefined
            }
          />
        ))}
      </div>

      <Footer />

      {/* KEYCAP 3D MODAL */}
      {selectedDesign && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative">
            
            <button
              className="absolute top-3 right-3 text-xl font-bold"
              onClick={() => setSelectedDesign(null)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedDesign.preferred_sticker}
            </h2>

            <KeycapViewer
              imageUrl={selectedDesign.design_image_url ?? "/logo.png"}
              offset={{
                x: selectedDesign.offset_x ?? 0,
                y: selectedDesign.offset_y ?? 0,
              }}
              scale={selectedDesign.scale ?? 1}
              keycapColor={selectedDesign.keycap_color ?? "#ffffff"}
              switchColor={selectedDesign.switch_color ?? "#cccccc"}
              switchCasingColor={selectedDesign.case_color ?? "#000000"}
            />

            <p className="mt-4 text-gray-600">
              {selectedDesign.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}