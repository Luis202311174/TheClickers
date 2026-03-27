"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useProfile(user: any) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted) return;

        if (error && error.message) {
          console.error("Profile error:", error.message);
        }

        setProfile(data);

      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("Profile fetch failed:", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  return { profile, loading };
}