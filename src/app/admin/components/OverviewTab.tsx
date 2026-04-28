"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, MessageSquare, IndianRupee, TrendingUp, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

export default function OverviewTab() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    enquiries: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, ordersRes, enquiriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders"),
          fetch("/api/enquiry"),
        ]);

        const products = await productsRes.json();
        const orders = await ordersRes.json();
        const enquiries = await enquiriesRes.json();

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          enquiries: Array.isArray(enquiries) ? enquiries.length : 0,
          revenue: Array.isArray(orders) ? orders.reduce((acc, o) => acc + (o.payment_status === "paid" ? o.subtotal : 0), 0) : 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.products, icon: Package, color: "text-gold" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "text-blue-400" },
    { label: "Active Enquiries", value: stats.enquiries, icon: MessageSquare, color: "text-gold" },
    { label: "Total Revenue", value: formatPrice(stats.revenue), icon: IndianRupee, color: "text-success" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-bg-secondary border border-border" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl text-cream">Dashboard Overview</h2>
        <p className="text-text-muted text-sm tracking-widest uppercase mt-1">Live Store Performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-bg-secondary border border-border group hover:border-gold/30 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-white/5 rounded-sm ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-serif text-cream">{stat.value}</p>
            <p className="text-[10px] tracking-widest uppercase text-text-muted mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Mini-Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-bg-secondary border border-border p-6">
          <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-6 font-semibold">Store Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-cream">Unprocessed Enquiries</span>
              </div>
              <span className="text-gold font-serif">{stats.enquiries}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold" />
                <span className="text-sm text-cream">Pending Orders</span>
              </div>
              <span className="text-gold font-serif">{stats.orders}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-cream">Inventory Health</span>
              </div>
              <span className="text-gold font-serif">Stable</span>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary border border-border p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Package className="w-32 h-32 text-gold" />
          </div>
          <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-6 font-semibold">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-border text-left hover:border-gold transition-all">
              <p className="text-xs tracking-widest uppercase text-text-muted mb-1">Products</p>
              <p className="text-sm text-cream">Add New Piece</p>
            </button>
            <button className="p-4 border border-border text-left hover:border-gold transition-all">
              <p className="text-xs tracking-widest uppercase text-text-muted mb-1">Invoices</p>
              <p className="text-sm text-cream">Generate GST</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
