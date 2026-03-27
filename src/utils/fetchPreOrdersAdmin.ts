import { supabase } from "@/lib/supabaseClient";

export type PreOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_for_pick_up"
  | "claimed"
  | "cancelled"
  | "cancelled_admin";

export type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  offset_x?: number;
  offset_y?: number;
  scale?: number;
};

export type PreOrder = {
  id: string;
  user_id: string;
  status: PreOrderStatus;
  keycap_color: string;
  switch_color: string;
  case_color: string;
  quantity: number;
  total_price: number;
  created_at: string;
  offset_x: number;
  offset_y: number;
  scale: number;
  design_visibility: Record<string, boolean>;
  product: Product;
};

export type GroupedPreOrder = {
  product: Product;
  orders: PreOrder[];
  total_quantity: number;
};

/**
 * Fetch all pre-orders with normalized product data.
 */
export async function fetchPreOrdersAdmin(): Promise<PreOrder[]> {
  try {
    // Fetch raw pre-orders
    const { data: ordersData, error: ordersError } = await supabase
      .from("pre_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersError) throw ordersError;
    if (!ordersData) return [];

    // Fetch product details in batch using product_ids
    const productIds = Array.from(
      new Set(ordersData.map((o: any) => o.product_id))
    );

    const { data: productsData } = await supabase
      .from("products")
      .select("id, name, price, image_url, offset_x, offset_y, scale")
      .in("id", productIds);

    const productsMap: Record<string, Product> = {};
    productsData?.forEach((p: any) => {
      // Convert storage path to public URL if needed
      let imageUrl = p.image_url || "/logo.png";
        if (imageUrl && !imageUrl.startsWith("http")) {
        const { data } = supabase.storage
            .from("products")
            .getPublicUrl(imageUrl);

        imageUrl = data.publicUrl; // ✅ correct usage
        }

      productsMap[p.id] = {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image_url: imageUrl,
        offset_x: Number(p.offset_x || 0),
        offset_y: Number(p.offset_y || 0),
        scale: Number(p.scale || 1),
      };
    });

    // Map orders with product data
    const preOrders: PreOrder[] = ordersData.map((o: any) => {
      const product = productsMap[o.product_id] || {
        id: "",
        name: "Unknown Product",
        price: 0,
        image_url: "/logo.png",
      };

      return {
        ...o,
        quantity: Number(o.quantity),
        total_price: Number(o.total_price),
        offset_x: Number(o.offset_x || 0),
        offset_y: Number(o.offset_y || 0),
        scale: Number(o.scale || 1),
        product,
      };
    });

    // Debug log
    if (preOrders.length > 0) {
      console.log("First pre-order:", preOrders[0]);
      console.log("First pre-order product:", preOrders[0].product);
    }

    return preOrders;
  } catch (err: any) {
    console.error("Error fetching admin pre-orders:", err.message);
    return [];
  }
}

/**
 * Group pre-orders by product
 */
export async function fetchPreOrdersGrouped(): Promise<GroupedPreOrder[]> {
  const preOrders = await fetchPreOrdersAdmin();

  const grouped: Record<string, GroupedPreOrder> = {};

  for (const order of preOrders) {
    const pid = order.product.id;
    if (!grouped[pid]) {
      grouped[pid] = { product: order.product, orders: [], total_quantity: 0 };
    }
    grouped[pid].orders.push(order);
    grouped[pid].total_quantity += order.quantity;
  }

  return Object.values(grouped);
}