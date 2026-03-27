"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { syncProfile } from "@/utils/syncProfile";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // ✅ get session AFTER OAuth redirect
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error.message);
          return;
        }

        const user = session?.user;

        // 🔥 THIS is the important part
        if (user) {
          await syncProfile(user);
        }

        // optional but fine
        await supabase.auth.refreshSession();

        router.replace("/");
      } catch (err) {
        console.error("OAuth callback error:", err);
      }
    };

    handleAuth();
  }, [router]);

  return <p className="text-center mt-10">Logging you in...</p>;
}