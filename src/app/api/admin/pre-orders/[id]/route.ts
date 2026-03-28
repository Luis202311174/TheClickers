import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Unwrap params (required in latest Next.js)
    const { id } = await context.params;

    const { status } = await req.json();

    const allowedStatuses = [
      "pending",
      "confirmed",
      "in_production",
      "ready_for_pick_up",
      "claimed",
      "cancelled",
      "cancelled_admin",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // OPTIONAL: check if record exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("pre_orders")
      .select("status")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // Update status
    const { data, error } = await supabaseAdmin
      .from("pre_orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}