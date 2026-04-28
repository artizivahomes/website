"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ChevronDown, ChevronUp, Clock, CheckCircle, Truck, Package, XCircle, MoreVertical } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(id: string, newStatus: OrderStatus) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, order_status: newStatus } : o));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  async function updatePaymentStatus(id: string, newStatus: PaymentStatus) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, payment_status: newStatus } : o));
      }
    } catch (err) {
      console.error("Failed to update payment status:", err);
    }
  }

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    in_production: Package,
    ready_to_ship: Truck,
    delivered: CheckCircle,
  };

  const statusColors = {
    pending: "text-gold border-gold/30 bg-gold/5",
    confirmed: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    in_production: "text-purple-400 border-purple-400/30 bg-purple-400/5",
    ready_to_ship: "text-orange-400 border-orange-400/30 bg-orange-400/5",
    delivered: "text-success border-success/30 bg-success/5",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl text-cream">Order Management</h2>
        <p className="text-text-muted text-sm tracking-widest uppercase mt-1">Track sales and fulfilment</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-bg-secondary border border-border animate-pulse" />
          ))
        ) : orders.length === 0 ? (
          <div className="bg-bg-secondary border border-border p-20 text-center text-text-muted">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No orders recorded yet.</p>
          </div>
        ) : (
          orders.map((order) => {
            const StatusIcon = statusIcons[order.order_status] || Clock;
            const isExpanded = expandedOrder === order.id;

            return (
              <div key={order.id} className="bg-bg-secondary border border-border overflow-hidden">
                <div 
                  className="p-6 flex flex-wrap items-center justify-between gap-6 cursor-pointer hover:bg-white/2 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-[10px] tracking-widest uppercase text-text-muted mb-1">Order ID</p>
                    <p className="text-sm font-medium text-cream uppercase">#{order.id.slice(0, 8)}</p>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-[10px] tracking-widest uppercase text-text-muted mb-1">Customer</p>
                    <p className="text-sm text-cream">{order.customer_name}</p>
                    <p className="text-[10px] text-text-secondary">{order.customer_email}</p>
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <p className="text-[10px] tracking-widest uppercase text-text-muted mb-1">Total</p>
                    <p className="text-sm text-gold font-serif">{formatPrice(order.subtotal)}</p>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-[10px] tracking-widest uppercase text-text-muted mb-1">Status</p>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm border text-[10px] tracking-widest uppercase ${statusColors[order.order_status]}`}>
                      <StatusIcon className="w-3 h-3" />
                      {order.order_status.replace("_", " ")}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-border/50 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] tracking-widest uppercase text-gold font-semibold">Line Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex gap-3 text-xs">
                            <div className="w-10 h-10 bg-bg-primary border border-border relative shrink-0">
                              {item.product.images[0] && <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <p className="text-cream">{item.product.title}</p>
                              <p className="text-text-muted">{item.quantity} x {formatPrice(item.product.price || 0)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] tracking-widest uppercase text-gold font-semibold">Shipping Details</h4>
                      <div className="text-xs text-text-secondary space-y-1">
                        <p className="text-cream">{order.customer_name}</p>
                        <p>{order.customer_phone}</p>
                        <p className="pt-2">{order.customer_address}</p>
                        <p>{order.customer_city} - {order.customer_pin}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] tracking-widest uppercase text-gold font-semibold mb-3">Update Order Status</h4>
                        <select 
                          value={order.order_status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="w-full bg-bg-primary border border-border px-3 py-2 text-xs text-cream outline-none focus:border-gold"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_production">In Production</option>
                          <option value="ready_to_ship">Ready to Ship</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                      <div>
                        <h4 className="text-[10px] tracking-widest uppercase text-gold font-semibold mb-3">Payment Status</h4>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-[10px] tracking-widest uppercase border ${order.payment_status === "paid" ? "bg-success/10 border-success/30 text-success" : "bg-error/10 border-error/30 text-error"}`}>
                            {order.payment_status}
                          </span>
                          {order.payment_status === "pending" && (
                            <button 
                              onClick={() => updatePaymentStatus(order.id, "paid")}
                              className="text-[10px] tracking-widest uppercase text-gold hover:text-cream transition-colors"
                            >
                              Mark as Paid
                            </button>
                          )}
                        </div>
                        {order.payment_id && (
                          <p className="text-[10px] text-text-muted mt-2">Ref: {order.payment_id}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
