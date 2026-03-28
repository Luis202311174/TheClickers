import { supabase } from "@/lib/supabaseClient";
import { CustomerDesign } from "@/components/CustomerDetailedList";

export async function fetchCustomerDesigns(): Promise<CustomerDesign[]> {
  const { data, error } = await supabase
    .from("customer_designs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error);
    return [];
  }

  // ✅ filter valid product IDs only
  const productIds = [
    ...new Set(
      data
        .map((d) => d.product_id)
        .filter((id): id is string => !!id)
    ),
  ];

  let productMap: Record<string, any> = {};

  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, name, image_url, offset_x, offset_y, scale")
      .in("id", productIds);

    products?.forEach((p) => {
      let imageUrl = p.image_url || "/logo.png";

      if (imageUrl && !imageUrl.startsWith("http")) {
        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(imageUrl);

        imageUrl = data.publicUrl;
      }

      productMap[p.id] = {
        ...p,
        offset_x: Number(p.offset_x || 0),
        offset_y: Number(p.offset_y || 0),
        scale: Number(p.scale || 1),
        image_url: imageUrl,
      };
    });
  }

  return data.map((d) => ({
    ...d,
    product_id: d.product_id ?? null,

    offset_x: Number(d.offset_x || 0),
    offset_y: Number(d.offset_y || 0),
    scale: Number(d.scale || 1),

    product: d.product_id ? productMap[d.product_id] ?? null : null,
  }));
}