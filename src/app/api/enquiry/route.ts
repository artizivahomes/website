import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, email, phone, city_state, 
      categories, dimensions, materials, 
      table_base, style_description, 
      inspiration_images, timeline, source 
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const supabase = await createServiceClient();
    
    const { error: dbError } = await supabase.from("enquiries").insert({
      name,
      email,
      phone,
      city_state,
      categories,
      dimensions,
      materials,
      table_base,
      style_description,
      inspiration_images,
      timeline,
      discovery_source: source,
      status: "new"
    });

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}
