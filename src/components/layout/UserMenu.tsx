"use client";

import { User, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function UserMenu() {
  // Since we use custom cookie-based auth for admin, 
  // we can just make this a link to the admin dashboard.
  return (
    <Link
      href="/admin"
      className="text-[10px] uppercase tracking-[0.2em] text-gold hover:text-cream transition-colors flex items-center gap-2 px-3 py-1.5 border border-gold rounded-sm"
    >
      <span>Admin</span>
      <User className="w-3 h-3" />
    </Link>
  );
}
