import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { getEnquiryAdminEmail } from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  console.log("Enquiry submission started");
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

    const supabase = createServiceClient();
    
    console.log("Inserting enquiry into DB...");
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

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      throw dbError;
    }
    console.log("Enquiry saved successfully to DB");

    // Send Admin Notification via Resend
    // We do NOT await this to avoid hanging the response if Resend is slow
    resend.emails.send({
      from: "Artiziva Homes <hello@artizivahomes.com>",
      to: ["artiziva.homes@gmail.com"],
      subject: `New Enquiry: ${name}`,
      html: getEnquiryAdminEmail(body)
    }).then(({ data, error }) => {
      if (error) console.error("Resend Error:", error);
      else console.log("Admin notification email queued:", data?.id);
    }).catch(err => {
      console.error("Resend Fatal Error:", err);
    });

    return NextResponse.json({ success: true, message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Enquiry submission fatal error:", error);
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

    const supabase = createServiceClient();
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

    const supabase = createServiceClient();
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
