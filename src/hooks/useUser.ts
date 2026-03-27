"use client";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export function useUser() {
  const { user, loading: authLoading, logout } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user);

  const loading = authLoading || profileLoading;

  // 🔗 merge safely
  const userWithProfile = user
    ? {
        ...user,
        role: profile?.role || "user",
        profile, // optional: include full profile
      }
    : null;

  return {
    user: userWithProfile,
    loading,
    logout,
  };
}