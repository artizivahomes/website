"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, MapPin, Phone, Mail, Upload, X, ChevronDown } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/ui/Icons";
import { INSTAGRAM_URL } from "@/lib/constants";

const PROJECT_CATEGORIES = [
  "Dining Tables",
  "River Tables",
  "Center / Coffee Table",
  "3D Geode Wall Art / Installation",
  "Bespoke Door / Basin",
  "Bulk Gifting / Corporate Orders",
  "Others",
];

const MATERIALS = [
  "Natural Wood - Teak",
  "Natural Wood - Walnut",
  "Epoxy Resin",
  "Crystal / Stone Inlays",
  "Metal Accents",
];

const TABLE_BASES = [
  "Matte Black Industrial",
  "Gold / Champagne Finish",
  "Wooden Base",
];

const TIMELINES = [
  "Immediate (within 4 weeks)",
  "1-2 months",
  "Just exploring for now",
];

const SOURCES = [
  "Instagram",
  "Exhibition / Expo",
  "Existing Customer Referral",
  "Google Search",
];

export default function ContactContent() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    
    const formData = new FormData(e.currentTarget);
    
    let uploadedImageUrls: string[] = [];
    if (files.length > 0) {
      try {
        const uploadData = new FormData();
        files.forEach(f => uploadData.append("files", f));
        
        const uploadRes = await fetch("/api/enquiry/upload", {
          method: "POST",
          body: uploadData,
        });
        const uploadResult = await uploadRes.json();
        if (uploadResult.urls) {
          uploadedImageUrls = uploadResult.urls;
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        // We still proceed with the enquiry even if images fail
      }
    }

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      city_state: formData.get("city_state"),
      categories: selectedCategories,
      dimensions: formData.get("dimensions"),
      materials: Array.from(e.currentTarget.querySelectorAll('input[type="checkbox"]:checked')).map((el: any) => el.nextElementSibling.textContent),
      table_base: (e.currentTarget.querySelector('input[name="table_base"]:checked') as HTMLInputElement)?.nextElementSibling?.textContent,
      style_description: formData.get("style_description"),
      timeline: formData.get("timeline"),
      source: formData.get("source"),
      inspiration_images: uploadedImageUrls,
    };

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit");
      setFormState("success");
      setFiles([]);
      setSelectedCategories([]);
    } catch (err) {
      console.error(err);
      setFormState("error");
    }
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  if (formState === "success") {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center max-w-lg p-12 glass-strong border border-gold/20"
        >
          <CheckCircle className="w-20 h-20 text-gold mx-auto mb-8" />
          <h2 className="font-serif text-4xl text-cream mb-4 tracking-wide">Inquiry Received</h2>
          <p className="text-text-secondary text-lg mb-8">
            Thank you for sharing your vision. We are excited to collaborate on your functional masterpiece.
          </p>
          <button 
            onClick={() => setFormState("idle")}
            className="text-gold uppercase tracking-[0.2em] text-xs hover:text-cream transition-colors"
          >
            Submit Another Inquiry
          </button>
        </motion.div>
      </section>
    );
  }

  const inputClass = "w-full bg-bg-card/50 border border-border px-4 py-3.5 text-cream text-sm placeholder:text-text-muted focus:border-gold outline-none transition-all duration-300 rounded-none";
  const labelClass = "block text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2 font-medium";

  return (
    <>
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute inset-0 resin-gradient opacity-40" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-4xl md:text-7xl text-cream mb-6 tracking-tight leading-tight">
              Bring Your <span className="gold-text">Vision</span> To Life!
            </h1>
            <div className="w-24 h-0.5 gold-gradient mx-auto mb-8" />
            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Share your requirements and let us create a functional masterpiece for your space.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="relative"
          >
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative z-10 glass-strong border border-white/5 p-8 md:p-16 luxury-shadow overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-gold/30" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-gold/30" />

              <div className="space-y-12">
                {/* 1. Personal Details */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-gold font-serif text-2xl">01</span>
                    <h3 className="text-xs tracking-[0.3em] uppercase text-cream font-semibold">Personal Details</h3>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
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
                    <div>
                      <label className={labelClass}>City & State *</label>
                      <input name="city_state" type="text" required placeholder="Siliguri, West Bengal" className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* 2. Project Category */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-gold font-serif text-2xl">02</span>
                    <h3 className="text-xs tracking-[0.3em] uppercase text-cream font-semibold">Project Category</h3>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <p className="text-xs text-text-muted mb-6">Choose one or more categories that fit your vision.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {PROJECT_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={cn(
                          "px-4 py-3 text-left text-xs transition-all duration-300 border",
                          selectedCategories.includes(cat) 
                            ? "bg-gold text-bg-primary border-gold font-bold" 
                            : "bg-white/5 border-white/10 text-text-secondary hover:border-gold/50"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Technical Specs */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-gold font-serif text-2xl">03</span>
                    <h3 className="text-xs tracking-[0.3em] uppercase text-cream font-semibold">Technical Specs</h3>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClass}>Approximate Dimensions (LxWxD)</label>
                      <input name="dimensions" type="text" placeholder="e.g., 96 x 42 x 2 inches" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Preferred Materials</label>
                      <div className="space-y-2">
                        {MATERIALS.map(mat => (
                          <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded-none border-border bg-bg-card checked:bg-gold accent-gold" />
                            <span className="text-sm text-text-secondary group-hover:text-cream transition-colors">{mat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Table Base / Legs</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {TABLE_BASES.map(base => (
                          <label key={base} className="flex items-center gap-3 cursor-pointer group p-4 border border-white/5 bg-white/5 hover:border-gold/30 transition-all">
                            <input type="radio" name="table_base" className="w-4 h-4 accent-gold" />
                            <span className="text-xs text-text-secondary group-hover:text-cream transition-colors">{base}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Design Inspiration */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-gold font-serif text-2xl">04</span>
                    <h3 className="text-xs tracking-[0.3em] uppercase text-cream font-semibold">Design Inspiration</h3>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Tell us about your style</label>
                      <textarea name="style_description" rows={4} placeholder="Describe the vibe, colors, or specific patterns you have in mind..." className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Upload Inspiration Images</label>
                      <div className="border-2 border-dashed border-white/10 hover:border-gold/30 p-10 text-center transition-all cursor-pointer relative group">
                        <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]); }} />
                        <Upload className="w-8 h-8 text-text-muted mx-auto mb-4 group-hover:text-gold transition-colors" />
                        <p className="text-cream text-sm mb-1 font-medium tracking-wide">Drop files or click to browse</p>
                        <p className="text-text-muted text-xs">Share screenshots, sketches, or color palettes</p>
                      </div>
                      {files.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {files.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 bg-bg-hover border border-white/10 px-3 py-2 text-[10px] text-cream uppercase tracking-widest">
                              <span className="max-w-[150px] truncate">{f.name}</span>
                              <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}><X className="w-3 h-3 text-gold" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Logistics & Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-gold font-serif text-2xl">05</span>
                      <h3 className="text-xs tracking-[0.3em] uppercase text-cream font-semibold">Logistics</h3>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>
                    <label className={labelClass}>Desired Timeline</label>
                    <select name="timeline" className={cn(inputClass, "appearance-none cursor-pointer")}>
                      <option value="" className="bg-bg-primary">Select Timeline</option>
                      {TIMELINES.map(t => <option key={t} value={t} className="bg-bg-primary">{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-gold font-serif text-2xl">06</span>
                      <h3 className="text-xs tracking-[0.3em] uppercase text-cream font-semibold">Discovery</h3>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>
                    <label className={labelClass}>How did you find us?</label>
                    <select name="source" className={cn(inputClass, "appearance-none cursor-pointer")}>
                      <option value="" className="bg-bg-primary">Select Source</option>
                      {SOURCES.map(s => <option key={s} value={s} className="bg-bg-primary">{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-8 text-center">
                  <button 
                    type="submit" 
                    disabled={formState === "submitting"}
                    className="btn-luxury btn-gold px-12 py-5 text-sm tracking-[0.3em] uppercase group w-full md:w-auto"
                  >
                    {formState === "submitting" ? "Submitting Inquiry..." : "Submit My Vision"}
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-2" />
                  </button>
                  <p className="mt-6 text-[10px] tracking-widest text-text-muted uppercase">
                    Our team typically responds within 24–48 working hours.
                  </p>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Direct Contact Icons */}
      <section className="pb-32 px-6 border-t border-white/5 pt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { icon: MapPin, title: "Our Studio", detail: "Siliguri, West Bengal, India", sub: "Visit by appointment only" },
            { icon: Phone, title: "Call Support", detail: "+91 98765 43210", sub: "Mon - Sat, 10am - 7pm" },
            { icon: Instagram, title: "Instagram", detail: "@artiziva.homes", sub: INSTAGRAM_URL },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="w-12 h-12 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/10 transition-all duration-500">
                <item.icon className="w-5 h-5 text-gold" />
              </div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-gold font-semibold mb-3">{item.title}</h4>
              <p className="text-cream text-lg mb-1">{item.detail}</p>
              <p className="text-text-muted text-xs">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
