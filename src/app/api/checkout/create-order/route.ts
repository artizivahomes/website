import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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

    // 1. Create order in our database
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

    // 2. Create Razorpay Order (50% of subtotal)
    // Razorpay expects amount in paise (100 paise = 1 INR)
    const advanceAmount = Math.round((subtotal / 2) * 100);
    
    const razorpayOrder = await razorpay.orders.create({
      amount: advanceAmount,
      currency: "INR",
      receipt: order.id,
      notes: {
        order_id: order.id,
        customer_email: customer_email,
        total_amount: subtotal,
        advance_amount: subtotal / 2,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      }
    });
  } catch (error: any) {
    console.error("Razorpay create order error:", {
      message: error.message,
      stack: error.stack,
      body: error.error?.description || error.error || error
    });
    return NextResponse.json({ 
      error: error.error?.description || error.message || "Failed to create order. Please check if payment keys are valid." 
    }, { status: 500 });
  }
}
