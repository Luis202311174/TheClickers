import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { syncProfile } from "@/utils/syncProfile";

const LOCAL_USER_KEY = "clickers_user";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const setAuthUser = async (sessionUser: any) => {
    if (!sessionUser) {
      setUser(null);
      localStorage.removeItem(LOCAL_USER_KEY);
      return;
    }

    try {
      // Fetch role from profiles table
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionUser.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      }

      // Combine role with user object
      const userWithRole = {
        ...sessionUser,
        role: profile?.role || "user",
      };

      setUser(userWithRole);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userWithRole));

      // Sync profile only if not already stored
      const existing = localStorage.getItem(LOCAL_USER_KEY);
      if (!existing) await syncProfile(userWithRole);
    } catch (err) {
      console.error("Error setting auth user:", err);
      setUser(sessionUser); // fallback
    }
  };

  useEffect(() => {
    const init = async () => {
      // Load saved user first
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) setUser(JSON.parse(saved));

      // Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await setAuthUser(session?.user || null);
      setLoading(false);
    };

    init();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await setAuthUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { user, logout, loading };
}