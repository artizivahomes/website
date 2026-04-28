import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { getEnquiryAdminEmail } from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send Admin Notification via Resend
    try {
      await resend.emails.send({
        from: "Artiziva Homes <hello@artizivahomes.com>",
        to: ["artiziva.homes@gmail.com"],
        subject: `New Enquiry: ${name}`,
        html: getEnquiryAdminEmail(body)
      });
    } catch (emailError) {
      console.error("Failed to send enquiry notification email:", emailError);
      // Don't fail the request if only email fails
    }

    return NextResponse.json({ success: true, message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}

// Admin GET: Fetch all enquiries
export async function GET(request: NextRequest) {
  try {
    const { getAdminSession } = await import("@/lib/auth");
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch enquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

// Admin PATCH: Update enquiry status/notes
export async function PATCH(request: NextRequest) {
  try {
    const { getAdminSession } = await import("@/lib/auth");
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("enquiries")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update enquiry error:", error);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}
