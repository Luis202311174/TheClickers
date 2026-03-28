import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { status } = await req.json();

    const allowedStatuses = [
      "draft",
      "pending",
      "confirmed",
      "in_production",
      "ready_for_pickup",
      "claimed",
      "cancelled",
      "declined",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("customer_designs")
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