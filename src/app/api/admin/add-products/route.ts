// /app/api/admin/add-products/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    const payloadRaw = formData.get("payload") as string;

    if (!file || !payloadRaw) {
      return NextResponse.json(
        { error: "Missing file or payload" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(payloadRaw);

    // 1. Upload image to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("product-images") // make sure this bucket exists
      .upload(fileName, file, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // 2. Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(fileName);

    const image_url = publicUrlData.publicUrl;

    // 3. Insert product
    const { error: insertError } = await supabaseAdmin.from("products").insert({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      is_preorder: payload.isPreorder,
      image_url,
      offset_x: payload.offset_x,
      offset_y: payload.offset_y,
      scale: payload.scale,
      slug: payload.slug,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}