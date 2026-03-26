import { supabase } from "@/lib/supabaseClient";

export async function fetchUserPreOrders(userId: string) {
  try {
    const { data, error } = await supabase
      .from("pre_orders")
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_url,
          category,
          offset_x,
          offset_y,
          scale
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err: any) {
    console.error("Error fetching pre-orders:", err.message);
    return [];
  }
}