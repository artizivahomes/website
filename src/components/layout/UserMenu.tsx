"use client";

import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { createClient, signInWithGoogle } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="text-[10px] uppercase tracking-[0.2em] text-text-secondary hover:text-gold transition-colors flex items-center gap-2 px-3 py-1.5 border border-border hover:border-gold rounded-sm"
      >
        <span className="hidden sm:inline">Sign In</span>
        <User className="w-3 h-3" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 border border-gold/30 rounded-full hover:bg-gold/10 transition-all"
      >
        {user.user_metadata?.avatar_url ? (
          <img src={user.user_metadata.avatar_url} alt="" className="w-6 h-6 rounded-full" />
        ) : (
          <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-gold" />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 glass-strong border border-white/10 p-2 shadow-2xl z-50"
          >
            <div className="px-3 py-2 border-b border-white/5 mb-2">
              <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-xs text-cream truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-widest text-text-secondary hover:text-gold hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
