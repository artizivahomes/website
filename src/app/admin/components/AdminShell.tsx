"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, Package, ShoppingCart, MessageSquare, 
  LogOut, ExternalLink, Menu, X, Tags
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "overview" | "products" | "categories" | "orders" | "enquiries";

interface AdminShellProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  children: React.ReactNode;
}

export default function AdminShell({ activeTab, setActiveTab, children }: AdminShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Tags },
    { id: "instagram", label: "Instagram", icon: Instagram },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare },
  ];

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-bg-secondary sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/admin" className="block">
            <h1 className="font-serif text-xl tracking-widest gold-text">ARTIZIVA</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-text-muted mt-1">Admin Panel</p>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase transition-all duration-300 ${
                activeTab === item.id 
                  ? "bg-gold/10 text-gold border-l-2 border-gold" 
                  : "text-text-secondary hover:text-cream hover:bg-bg-hover"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase text-text-muted hover:text-cream transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase text-error/70 hover:text-error transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-bg-secondary border-b border-border z-40 px-6 flex items-center justify-between">
        <h1 className="font-serif text-lg tracking-widest gold-text">ARTIZIVA</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 top-16 bg-bg-primary z-30 p-6 flex flex-col"
          >
            <nav className="space-y-2 mb-auto">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-4 text-sm tracking-widest uppercase border ${
                    activeTab === item.id ? "bg-gold text-bg-primary border-gold" : "border-border text-text-secondary"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="pt-6 border-t border-border space-y-4">
              <Link href="/" target="_blank" className="flex items-center gap-4 px-6 text-sm tracking-widest uppercase text-text-secondary">
                <ExternalLink className="w-5 h-5" /> View Site
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-4 px-6 text-sm tracking-widest uppercase text-error">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
