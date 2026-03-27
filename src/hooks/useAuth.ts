"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const LOCAL_USER_KEY = "clickers_user";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const setSessionUser = (sessionUser: any) => {
      if (!mounted) return;

      if (!sessionUser) {
        setUser(null);
        localStorage.removeItem(LOCAL_USER_KEY);
        return;
      }

      setUser(sessionUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(sessionUser));
    };

    const init = async () => {
      try {
        // ⚡ instant load from cache
        const cached = localStorage.getItem(LOCAL_USER_KEY);
        if (cached && mounted) {
          setUser(JSON.parse(cached));
        }

        // 🔐 get real session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSessionUser(session?.user || null);

      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSessionUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  return { user, loading, logout };
}