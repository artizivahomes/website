"use client";

import { useState, useEffect } from "react";
import { Instagram, RefreshCw, Check, AlertCircle, ExternalLink, Loader2 } from "lucide-react";

interface InstagramPost {
  id: string;
  image_url: string;
  post_url: string;
  caption: string;
  timestamp: string;
}

export default function InstagramTab() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/instagram/posts");
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/instagram/sync");
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message || "Sync successful!" });
        fetchPosts();
      } else {
        setMessage({ type: "error", text: data.error || "Sync failed. Check your Access Token." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Connection error" });
    } finally {
      setSyncing(false);
    }
  }

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" /></div>;

  return (
    <div className="p-8 space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-cream">Instagram Integration</h2>
          <p className="text-text-muted text-sm mt-1">Manage your automated studio gallery</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="btn-luxury btn-gold px-6 py-2.5 text-xs flex items-center gap-2"
        >
          {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Instagram className="w-4 h-4" />}
          Sync Latest Posts
        </button>
      </div>

      {message && (
        <div className={`p-4 border ${message.type === "success" ? "bg-success/10 border-success/30 text-success" : "bg-error/10 border-error/30 text-error"} flex items-center gap-3 text-sm`}>
          {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-bg-secondary border border-border group relative aspect-square overflow-hidden">
            <img src={post.image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p className="text-[10px] text-cream line-clamp-2 mb-2">{post.caption}</p>
              <a 
                href={post.post_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-gold flex items-center gap-1 hover:underline"
              >
                View on Instagram <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-20 border border-dashed border-border text-center text-text-muted">
            No posts synced yet. Click "Sync Latest Posts" to fetch from Instagram.
          </div>
        )}
      </div>

      <div className="p-6 bg-bg-secondary border border-border">
        <h3 className="text-xs tracking-widest uppercase text-gold font-bold mb-4">Automation Details</h3>
        <ul className="space-y-2 text-xs text-text-secondary">
          <li className="flex items-center gap-2">• Scheduled to sync on the 1st and 16th of every month.</li>
          <li className="flex items-center gap-2">• Requires <code className="bg-black/40 px-1 text-gold">INSTAGRAM_ACCESS_TOKEN</code> in your environment variables.</li>
          <li className="flex items-center gap-2">• Fetches the latest 12 posts from your professional account.</li>
        </ul>
      </div>
    </div>
  );
}
