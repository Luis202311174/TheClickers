import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { syncProfile } from "@/utils/syncProfile";

const LOCAL_USER_KEY = "clickers_user";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // 👈 ADD THIS

  const setAuthUser = async (sessionUser: any) => {
    setUser(sessionUser);

    if (sessionUser) {
        const existing = localStorage.getItem(LOCAL_USER_KEY);

        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(sessionUser));

        // ✅ Only sync if user wasn't already stored
        if (!existing) {
        await syncProfile(sessionUser);
        }
    } else {
        localStorage.removeItem(LOCAL_USER_KEY);
    }
    };

  useEffect(() => {
    const init = async () => {
      // ✅ ONLY run on client
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      await setAuthUser(session?.user || null);
      setLoading(false); // 👈 DONE LOADING
    };

    init();

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

  return { user, logout, loading }; // 👈 return loading
}