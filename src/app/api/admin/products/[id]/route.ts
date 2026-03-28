// /app/api/admin/products/[id]/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ IMPORTANT FIX

    const { data, error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("SUPABASE DELETE ERROR:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("DELETE ROUTE ERROR:", err);

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}