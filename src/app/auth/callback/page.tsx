"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // 🔥 This is the missing piece
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        return;
      }

      // Optional: force refresh session (helps sometimes)
      await supabase.auth.refreshSession();

      router.replace("/");
    };

    handleAuth();
  }, [router]);

  return <p className="text-center mt-10">Logging you in...</p>;
}