import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, category, budget, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
    }

    // TODO: Insert into Supabase
    // const { createServiceClient } = await import("@/lib/supabase/server");
    // const supabase = await createServiceClient();
    // const { error: dbError } = await supabase.from("enquiries").insert({
    //   name, email, phone, product_category: category,
    //   budget_range: budget, message,
    // });
    // if (dbError) throw dbError;

    // TODO: Send confirmation email via Resend
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: process.env.RESEND_FROM_EMAIL!,
    //   to: email,
    //   subject: "Thank you for your enquiry — Artiziva Homes",
    //   html: `<p>Dear ${name},</p><p>Thank you for reaching out. Our team will get back to you within 24 hours.</p><p>Warm regards,<br/>Artiziva Homes</p>`,
    // });

    return NextResponse.json({ success: true, message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}
