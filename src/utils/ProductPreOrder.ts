import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Colors = {
  keycap: string;
  switch: string;
  casing: string;
};

export async function createPreOrder({
  userId,
  productId,
  colors,
  quantity = 1,
}: {
  userId: string;
  productId: string;
  colors: Colors;
  quantity?: number;
}) {
  try {
    // 1️⃣ Fetch product to calculate total price
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("price, offset_x, offset_y, scale")
      .eq("id", productId)
      .single();

    if (productError || !product) throw new Error("Product not found");

    const totalPrice = Number(product.price) * quantity;

    // 2️⃣ Insert pre-order
    const { data, error } = await supabase
      .from("pre_orders")
      .insert([
        {
          user_id: userId,
          product_id: productId,
          keycap_color: colors.keycap,
          switch_color: colors.switch,
          case_color: colors.casing,
          quantity,
          total_price: totalPrice,
          // optional: keep default offsets and scale
          offset_x: product.offset_x,
          offset_y: product.offset_y,
          scale: product.scale,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (err: any) {
    console.error("Error creating pre-order:", err.message);
    throw new Error(err.message || "Failed to create pre-order");
  }
}