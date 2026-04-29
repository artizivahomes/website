"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Send, CheckCircle, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const advanceAmount = subtotal / 2;
  const remainingAmount = subtotal - advanceAmount;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setError("");

    const formData = new FormData(e.currentTarget);
    const orderData = {
      customer_name: formData.get("name"),
      customer_email: formData.get("email"),
      customer_phone: formData.get("phone"),
      customer_address: formData.get("address"),
      customer_city: formData.get("city"),
      customer_pin: formData.get("pin"),
      items: items.map(item => ({
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          images: item.product.images
        },
        quantity: item.quantity
      })),
      subtotal: subtotal,
    };

    try {
      // 1. Create Order and get Razorpay details
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate payment");

      // 2. Check if Razorpay is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        throw new Error("Payment gateway (Razorpay) is not loaded yet. Please refresh or wait a few seconds.");
      }

      // 3. Trigger Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_Sj5fG60i9k724u",
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: "Artiziva Homes",
        description: "50% Advance Payment for Order",
        image: "/logo.png",
        order_id: data.razorpayOrder.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");

            setFormState("success");
            clearCart();
          } catch (err: any) {
            setError(err.message);
            setFormState("error");
          }
        },
        prefill: {
          name: orderData.customer_name,
          email: orderData.customer_email,
          contact: orderData.customer_phone,
        },
        theme: {
          color: "#D4AF37",
        },
        modal: {
          ondismiss: function() {
            setFormState("idle");
          }
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          setError("Payment failed: " + response.error.description);
          setFormState("error");
        });
        rzp.open();
      } catch (err: any) {
        setError("Could not open payment gateway: " + err.message);
        setFormState("error");
      }
    } catch (err: any) {
      setError(err.message);
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg p-12 glass-strong border border-gold/20">
          <CheckCircle className="w-20 h-20 text-gold mx-auto mb-8" />
          <h2 className="font-serif text-4xl text-cream mb-4">Order Confirmed!</h2>
          <p className="text-text-secondary text-lg mb-8">
            Your 50% advance payment has been received. We've sent a confirmation email with your order details.
          </p>
          <div className="bg-bg-card/30 border border-gold/10 p-4 mb-8 text-sm text-text-muted">
            The remaining balance of {formatPrice(remainingAmount)} will be due at the time of dispatch.
          </div>
          <Link href="/shop" className="btn-luxury btn-gold px-8">Continue Shopping</Link>
        </motion.div>
      </section>
    );
  }

  const inputClass = "w-full bg-bg-card/50 border border-border px-4 py-3.5 text-cream text-sm placeholder:text-text-muted focus:border-gold outline-none transition-all duration-300";
  const labelClass = "block text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2 font-medium";

  return (
    <>
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/shop" className="inline-flex items-center gap-2 text-text-secondary hover:text-gold text-xs tracking-widest uppercase mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <h2 className="font-serif text-3xl text-cream mb-8">Checkout Details</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-4 bg-error/10 border border-error/30 text-error text-sm">{error}</div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Full Name *</label>
                    <input name="name" type="text" required placeholder="Shubham Jhawar" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email ID *</label>
                    <input name="email" type="email" required placeholder="contact@artizivahomes.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input name="phone" type="tel" required placeholder="+91 98XXX XXXXX" className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Full Address *</label>
                    <textarea name="address" rows={3} required placeholder="Street address, building, etc." className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>City *</label>
                    <input name="city" type="text" required placeholder="Siliguri" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>PIN Code *</label>
                    <input name="pin" type="text" required placeholder="734XXX" className={inputClass} />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={formState === "submitting" || items.length === 0}
                    className="btn-luxury btn-gold w-full py-5 text-sm tracking-[0.3em] uppercase group"
                  >
                    {formState === "submitting" ? "Processing..." : `Pay 50% Advance (${formatPrice(advanceAmount)})`}
                    <CreditCard className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                  </button>
                  <p className="mt-4 text-[10px] tracking-widest text-text-muted uppercase text-center flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-success" /> Secure SSL Encrypted Checkout
                  </p>
                </div>
              </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5">
              <div className="bg-bg-secondary border border-border p-8 sticky top-32">
                <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-6 font-semibold">Order Summary</h3>
                <div className="space-y-6 mb-8">
                  {items.length === 0 ? (
                    <p className="text-text-muted text-sm italic">Your cart is empty.</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.product.id} className="flex gap-4">
                        <div className="relative w-16 h-16 border border-border shrink-0 bg-bg-card/50 flex items-center justify-center">
                          {item.product.images?.[0] ? (
                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-text-muted opacity-20" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-cream font-serif">{item.product.title}</p>
                          <p className="text-xs text-text-muted">{item.quantity} x {formatPrice(item.product.price || 0)}</p>
                        </div>
                        <p className="text-sm text-gold font-serif">{formatPrice((item.product.price || 0) * item.quantity)}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary uppercase tracking-widest text-[10px]">Total Order Value</span>
                    <span className="text-cream">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-l-2 border-gold/30 pl-4 py-1 bg-gold/5">
                    <div>
                      <span className="text-gold uppercase tracking-widest text-[10px] block font-bold">50% Advance to Pay Now</span>
                      <span className="text-[9px] text-text-muted uppercase">To confirm your order</span>
                    </div>
                    <span className="text-gold font-bold">{formatPrice(advanceAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm pl-4 opacity-60">
                    <div>
                      <span className="text-text-secondary uppercase tracking-widest text-[10px] block">Remaining Balance</span>
                      <span className="text-[9px] text-text-muted uppercase">Due at time of dispatch</span>
                    </div>
                    <span className="text-cream">{formatPrice(remainingAmount)}</span>
                  </div>
                  
                  <div className="border-t border-border pt-4 flex justify-between items-center">
                    <span className="text-cream uppercase tracking-widest text-xs font-semibold">Amount Payable Now</span>
                    <span className="text-2xl font-serif gold-text">{formatPrice(advanceAmount)}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-bg-card/50 border border-border text-[10px] text-text-muted leading-relaxed uppercase tracking-wider">
                  <p className="flex gap-2">
                    <span className="text-gold">●</span>
                    All pieces are handcrafted and unique.
                  </p>
                  <p className="flex gap-2 mt-2">
                    <span className="text-gold">●</span>
                    50% advance is required to begin processing/shipping.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
