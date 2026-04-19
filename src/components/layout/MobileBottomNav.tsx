"use client";

import Link from "next/link";
import { Home, ShoppingBag, Users, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: ShoppingBag },
    { label: "Team", href: "/team", icon: Users },
    { label: "Contact", href: "/contact", icon: MessageSquare },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
      <nav className="glass-strong border border-white/10 rounded-2xl flex items-center justify-around py-3 px-2 luxury-shadow">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 px-3",
                isActive ? "text-gold" : "text-text-muted hover:text-cream"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
              <span className="text-[10px] tracking-widest uppercase font-medium">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-gold rounded-full absolute -bottom-1" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
