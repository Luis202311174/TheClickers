// /app/api/admin/products/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data || [] });
  } catch (err) {
    console.error("Unexpected GET error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}