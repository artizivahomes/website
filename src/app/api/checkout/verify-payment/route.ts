import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { Resend } from "resend";
import { getOrderConfirmationEmail } from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { 
      orderId, 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await request.json();

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Update order in database
    const supabase = await createServiceClient();
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        payment_id: razorpay_payment_id,
        notes: `50% Advance paid via Razorpay. Payment ID: ${razorpay_payment_id}`
      })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 3. Send confirmation email
    try {
      await resend.emails.send({
        from: "Artiziva Homes <hello@artizivahomes.com>",
        to: [order.customer_email],
        cc: ["artiziva.homes@gmail.com"],
        subject: `Order Confirmed - #${order.id.slice(0, 8).toUpperCase()}`,
        html: getOrderConfirmationEmail(order, order.customer_name)
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Razorpay verify payment error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 });
  }
}
