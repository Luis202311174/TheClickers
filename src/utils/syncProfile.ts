// utils/syncProfile.ts
import { supabase } from "@/lib/supabaseClient";

export async function syncProfile(user: any) {
  if (!user) return;

  const fullName = user.user_metadata?.full_name || "";
  const avatar = user.user_metadata?.avatar_url || "";

  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    pfp_logo: avatar,
    role: "customer", // force customer
  });
}