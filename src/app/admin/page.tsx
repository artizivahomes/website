"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Package, MessageSquare, ShoppingCart, FileText,
  Plus, Eye, Edit, Trash2, Search, Filter,
  CheckCircle, Clock, AlertCircle, LogOut,
  LayoutDashboard, Users, Settings,
} from "lucide-react";
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

type Tab = "dashboard" | "products" | "enquiries" | "orders" | "billing";

const mockEnquiries = [
  { id: "1", name: "Ananya Mehta", email: "ananya@gmail.com", phone: "+91 98765 43210", category: "Dining Tables", budget: "₹2,00,000 - ₹5,00,000", status: "new", date: "2026-04-18" },
  { id: "2", name: "Vikram S.", email: "vikram@outlook.com", phone: "+91 87654 32109", category: "Coffee Tables", budget: "₹1,00,000 - ₹2,00,000", status: "in_progress", date: "2026-04-16" },
  { id: "3", name: "Meera Agarwal", email: "meera@gmail.com", phone: "+91 76543 21098", category: "3D Wall Hangings", budget: "₹50,000 - ₹1,00,000", status: "completed", date: "2026-04-12" },
];

const statusColors: Record<string, string> = {
  new: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  in_progress: "text-gold bg-gold/10 border-gold/30",
  completed: "text-success bg-success/10 border-success/30",
};

const statusIcons: Record<string, React.ElementType> = {
  new: AlertCircle,
  in_progress: Clock,
  completed: CheckCircle,
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "products" as Tab, label: "Products", icon: Package },
    { id: "enquiries" as Tab, label: "Enquiries", icon: MessageSquare },
    { id: "orders" as Tab, label: "Orders", icon: ShoppingCart },
    { id: "billing" as Tab, label: "Billing", icon: FileText },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl text-cream">Admin Panel</h1>
            <p className="text-text-muted text-sm">Manage your store, products, and enquiries</p>
          </div>
          <Link href="/" className="flex items-center gap-2 text-xs text-text-secondary hover:text-gold transition-colors tracking-widest uppercase">
            <LogOut className="w-4 h-4" /> Exit Admin
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2 border-b border-border">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wider uppercase whitespace-nowrap transition-all ${
                activeTab === tab.id ? "text-gold border-b-2 border-gold" : "text-text-secondary hover:text-cream"
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Products", value: PRODUCTS.length.toString(), icon: Package, color: "text-gold" },
                { label: "Active Enquiries", value: "2", icon: MessageSquare, color: "text-blue-400" },
                { label: "Orders", value: "0", icon: ShoppingCart, color: "text-success" },
                { label: "Revenue", value: "₹0", icon: FileText, color: "text-gold" },
              ].map((stat) => (
                <div key={stat.label} className="p-5 bg-bg-card border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="font-serif text-2xl text-cream">{stat.value}</p>
                  <p className="text-text-muted text-xs tracking-wider uppercase mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-bg-card border border-border">
                <h3 className="text-sm tracking-wider uppercase text-gold mb-4">Recent Enquiries</h3>
                <div className="space-y-3">
                  {mockEnquiries.map((e) => {
                    const StatusIcon = statusIcons[e.status];
                    return (
                      <div key={e.id} className="flex items-center justify-between p-3 bg-bg-hover">
                        <div>
                          <p className="text-cream text-sm">{e.name}</p>
                          <p className="text-text-muted text-xs">{e.category} · {e.date}</p>
                        </div>
                        <span className={`flex items-center gap-1 px-2 py-1 text-[10px] tracking-wider uppercase border ${statusColors[e.status]}`}>
                          <StatusIcon className="w-3 h-3" /> {e.status.replace("_", " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-6 bg-bg-card border border-border">
                <h3 className="text-sm tracking-wider uppercase text-gold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Add Product", icon: Plus, action: () => setActiveTab("products") },
                    { label: "View Enquiries", icon: Eye, action: () => setActiveTab("enquiries") },
                    { label: "Manage Orders", icon: ShoppingCart, action: () => setActiveTab("orders") },
                    { label: "Generate Invoice", icon: FileText, action: () => setActiveTab("billing") },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action} className="p-4 border border-border hover:border-gold text-left transition-colors group">
                      <item.icon className="w-5 h-5 text-text-muted group-hover:text-gold mb-2 transition-colors" />
                      <p className="text-cream text-sm">{item.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="text" placeholder="Search products..." className="bg-bg-card border border-border pl-10 pr-4 py-2 text-sm text-cream placeholder:text-text-muted w-64 focus:border-gold transition-colors" />
                </div>
              </div>
              <button className="btn-luxury btn-gold text-xs py-2 px-4">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            <div className="border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-bg-hover">
                    <tr>
                      <th className="text-left px-4 py-3 text-text-muted text-xs tracking-wider uppercase">Product</th>
                      <th className="text-left px-4 py-3 text-text-muted text-xs tracking-wider uppercase">Category</th>
                      <th className="text-left px-4 py-3 text-text-muted text-xs tracking-wider uppercase">Price</th>
                      <th className="text-left px-4 py-3 text-text-muted text-xs tracking-wider uppercase">Status</th>
                      <th className="text-right px-4 py-3 text-text-muted text-xs tracking-wider uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCTS.map((p) => (
                      <tr key={p.id} className="border-t border-border hover:bg-bg-hover/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 shrink-0 overflow-hidden">
                              <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                            </div>
                            <span className="text-cream font-medium">{p.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{p.category}</td>
                        <td className="px-4 py-3 text-gold">{p.price ? formatPrice(p.price) : "On Request"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[10px] tracking-wider uppercase border ${p.isSold ? statusColors.completed : "text-success bg-success/10 border-success/30"}`}>
                            {p.isSold ? "Sold" : "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-text-muted hover:text-gold transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                            <button className="p-1.5 text-text-muted hover:text-error transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Enquiries Tab */}
        {activeTab === "enquiries" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-bg-hover">
                    <tr>
                      <th className="text-left px-4 py-3 text-text-muted text-xs tracking-wider uppercase">Client</th>
                      <th className="text-left px-4 py-3 text-text-muted text-xs tracking-wider uppercase">Category</th>
                      <th className="text-left px-4 py-3 text-text-muted text-xs tracking-wider uppercase">Budget</th>
                      <th className="text-left px-4 py-3 text-text-muted text-xs tracking-wider uppercase">Date</th>
                      <th className="text-left px-4 py-3 text-text-muted text-xs tracking-wider uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockEnquiries.map((e) => {
                      const StatusIcon = statusIcons[e.status];
                      return (
                        <tr key={e.id} className="border-t border-border hover:bg-bg-hover/50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-cream">{e.name}</p>
                            <p className="text-text-muted text-xs">{e.email}</p>
                          </td>
                          <td className="px-4 py-3 text-text-secondary">{e.category}</td>
                          <td className="px-4 py-3 text-gold text-xs">{e.budget}</td>
                          <td className="px-4 py-3 text-text-secondary text-xs">{e.date}</td>
                          <td className="px-4 py-3">
                            <span className={`flex items-center gap-1 w-fit px-2 py-0.5 text-[10px] tracking-wider uppercase border ${statusColors[e.status]}`}>
                              <StatusIcon className="w-3 h-3" /> {e.status.replace("_", " ")}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <ShoppingCart className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="font-serif text-xl text-cream mb-2">No orders yet</p>
            <p className="text-text-muted text-sm">Orders will appear here once customers start purchasing.</p>
          </motion.div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="font-serif text-xl text-cream mb-2">Billing & GST</p>
            <p className="text-text-muted text-sm mb-4">Invoice generation and GST filing tools coming soon.</p>
            <p className="text-text-muted text-xs">This section will support basic invoice generation and export for manual GST filing.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
