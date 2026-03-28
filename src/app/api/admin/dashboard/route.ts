import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const [productsRes, preOrdersRes] = await Promise.all([
      supabaseAdmin
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }),

      supabaseAdmin
        .from("pre_orders")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (productsRes.error) console.error("Products error:", productsRes.error);
    if (preOrdersRes.error) console.error("PreOrders error:", preOrdersRes.error);

    if (productsRes.error || preOrdersRes.error) {
      return NextResponse.json(
        {
          error: "Database fetch error",
          details: {
            products: productsRes.error,
            preOrders: preOrdersRes.error,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: productsRes.data || [],
      preOrders: preOrdersRes.data || [],
    });
  } catch (err) {
    console.error("Unexpected API error:", err);

    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}