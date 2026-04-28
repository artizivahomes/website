import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { getOrderConfirmationEmail } from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customer_name, customer_email, customer_phone, 
      customer_address, customer_city, customer_pin,
      items, subtotal 
    } = body;

    if (!customer_name || !customer_email || !customer_phone || !customer_address || !customer_city || !customer_pin || !items || !subtotal) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city,
        customer_pin,
        items,
        subtotal,
        payment_status: "pending",
        order_status: "pending"
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Send confirmation email via Resend
    try {
      await resend.emails.send({
        from: "Artiziva Homes <hello@artizivahomes.com>",
        to: [customer_email],
        cc: ["artiziva.homes@gmail.com"],
        subject: `Order Received - #${order.id.slice(0, 8).toUpperCase()}`,
        html: getOrderConfirmationEmail(order, customer_name)
      });
    } catch (emailError) {
      console.error("Failed to send order email:", emailError);
      // Don't fail the request if only email fails
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// Admin GET: Fetch orders
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
