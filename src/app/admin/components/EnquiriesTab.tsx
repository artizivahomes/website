"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MessageSquare, ChevronDown, ChevronUp, Calendar, User, Phone, Mail, MapPin } from "lucide-react";
import type { Enquiry, EnquiryStatus } from "@/lib/types";

export default function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEnquiry, setExpandedEnquiry] = useState<string | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    setLoading(true);
    try {
      const res = await fetch("/api/enquiry");
      const data = await res.json();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: EnquiryStatus) {
    try {
      const res = await fetch("/api/enquiry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  const statusColors = {
    new: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    in_progress: "text-gold border-gold/30 bg-gold/5",
    completed: "text-success border-success/30 bg-success/5",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl text-cream">Enquiries</h2>
        <p className="text-text-muted text-sm tracking-widest uppercase mt-1">Manage custom commission requests</p>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-bg-secondary border border-border animate-pulse" />
          ))
        ) : enquiries.length === 0 ? (
          <div className="bg-bg-secondary border border-border p-20 text-center text-text-muted">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No enquiries found.</p>
          </div>
        ) : (
          enquiries.map((enquiry) => {
            const isExpanded = expandedEnquiry === enquiry.id;

            return (
              <div key={enquiry.id} className="bg-bg-secondary border border-border overflow-hidden">
                <div 
                  className="p-6 flex flex-wrap items-center justify-between gap-6 cursor-pointer hover:bg-white/2 transition-colors"
                  onClick={() => setExpandedEnquiry(isExpanded ? null : enquiry.id)}
                >
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-[10px] tracking-widest uppercase text-text-muted mb-1">Client</p>
                    <p className="text-sm font-medium text-cream">{enquiry.name}</p>
                    <p className="text-[10px] text-text-secondary">{enquiry.email}</p>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-[10px] tracking-widest uppercase text-text-muted mb-1">Categories</p>
                    <p className="text-xs text-cream truncate max-w-[200px]">
                      {enquiry.categories?.join(", ") || "General Inquiry"}
                    </p>
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <p className="text-[10px] tracking-widest uppercase text-text-muted mb-1">Date</p>
                    <p className="text-xs text-text-secondary">{new Date(enquiry.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-[10px] tracking-widest uppercase text-text-muted mb-1">Status</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-sm border text-[10px] tracking-widest uppercase ${statusColors[enquiry.status]}`}>
                      {enquiry.status.replace("_", " ")}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 border border-white/5 space-y-1">
                          <p className="text-[10px] tracking-widest uppercase text-gold/70">Phone</p>
                          <p className="text-sm text-cream">{enquiry.phone}</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 space-y-1">
                          <p className="text-[10px] tracking-widest uppercase text-gold/70">Location</p>
                          <p className="text-sm text-cream">{enquiry.city_state || "N/A"}</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 space-y-1">
                          <p className="text-[10px] tracking-widest uppercase text-gold/70">Timeline</p>
                          <p className="text-sm text-cream">{enquiry.timeline || "N/A"}</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 space-y-1">
                          <p className="text-[10px] tracking-widest uppercase text-gold/70">Source</p>
                          <p className="text-sm text-cream">{enquiry.discovery_source || "N/A"}</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 space-y-1">
                          <p className="text-[10px] tracking-widest uppercase text-gold/70">Dimensions</p>
                          <p className="text-sm text-cream">{enquiry.dimensions || "N/A"}</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 space-y-1">
                          <p className="text-[10px] tracking-widest uppercase text-gold/70">Table Base</p>
                          <p className="text-sm text-cream">{enquiry.table_base || "N/A"}</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white/5 border border-white/5 space-y-2">
                        <p className="text-[10px] tracking-widest uppercase text-gold/70">Style Vision</p>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {enquiry.style_description || "No description provided."}
                        </p>
                      </div>

                      <div className="p-4 bg-white/5 border border-white/5 space-y-2">
                        <p className="text-[10px] tracking-widest uppercase text-gold/70">Preferred Materials</p>
                        <div className="flex flex-wrap gap-2">
                          {enquiry.materials?.map(m => (
                            <span key={m} className="px-2 py-0.5 bg-gold/10 text-gold text-[10px] border border-gold/20 uppercase tracking-widest">
                              {m}
                            </span>
                          )) || <span className="text-xs text-text-muted italic">None selected</span>}
                        </div>
                      </div>

                      {enquiry.inspiration_images && enquiry.inspiration_images.length > 0 && (
                        <div className="p-4 bg-white/5 border border-white/5 space-y-3">
                          <p className="text-[10px] tracking-widest uppercase text-gold/70">Inspiration Images</p>
                          <div className="flex flex-wrap gap-4">
                            {enquiry.inspiration_images.map((img, idx) => (
                              <a 
                                key={idx} 
                                href={img} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="relative w-24 h-24 border border-border group overflow-hidden cursor-zoom-in"
                              >
                                <Image 
                                  src={img} 
                                  alt="Inspiration" 
                                  fill 
                                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] tracking-widest uppercase text-gold font-semibold mb-3">Enquiry Status</h4>
                        <select 
                          value={enquiry.status}
                          onChange={(e) => updateStatus(enquiry.id, e.target.value as EnquiryStatus)}
                          className="w-full bg-bg-primary border border-border px-3 py-2 text-xs text-cream outline-none focus:border-gold"
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="p-4 bg-gold/5 border border-gold/20 space-y-3">
                        <h4 className="text-[10px] tracking-widest uppercase text-gold font-semibold">Admin Notes</h4>
                        <textarea 
                          defaultValue={enquiry.notes || ""}
                          id={`notes-${enquiry.id}`}
                          placeholder="Add internal notes about this enquiry..."
                          className="w-full bg-bg-primary border border-border p-3 text-xs text-cream h-24 outline-none focus:border-gold"
                        />
                        <button 
                          onClick={() => {
                            const notes = (document.getElementById(`notes-${enquiry.id}`) as HTMLTextAreaElement).value;
                            updateNotes(enquiry.id, notes);
                          }}
                          className="text-[10px] tracking-widest uppercase text-gold hover:text-cream transition-colors"
                        >
                          Save Notes
                        </button>
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

  async function updateNotes(id: string, notes: string) {
    try {
      const res = await fetch("/api/enquiry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes }),
      });
      if (res.ok) {
        setEnquiries(enquiries.map(e => e.id === id ? { ...e, notes } : e));
        alert("Notes saved successfully");
      }
    } catch (err) {
      console.error("Failed to update notes:", err);
    }
  }
}
