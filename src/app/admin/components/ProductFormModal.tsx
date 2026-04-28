"use client";

import { useState, useEffect } from "react";
import { X, Upload, Plus, Trash2, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCT_CATEGORIES, EPOXY_MATERIALS } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductFormModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductFormModal({ product, isOpen, onClose, onSuccess }: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    category: PRODUCT_CATEGORIES[0] as string,
    price: "",
    price_on_request: false,
    featured: false,
    is_sold: false,
    dimensions: { length: "", width: "", height: "" },
    materials: [] as string[],
    images: [] as string[],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        slug: product.slug,
        short_description: product.short_description || "",
        description: product.description || "",
        category: product.category,
        price: product.price?.toString() || "",
        price_on_request: product.price_on_request,
        featured: product.featured,
        is_sold: product.is_sold,
        dimensions: product.dimensions,
        materials: product.materials,
        images: product.images,
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        short_description: "",
        description: "",
        category: PRODUCT_CATEGORIES[0],
        price: "",
        price_on_request: false,
        featured: false,
        is_sold: false,
        dimensions: { length: "", width: "", height: "" },
        materials: [],
        images: [],
      });
    }
  }, [product, isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      title, 
      slug: prev.slug === slugify(prev.title) ? slugify(title) : prev.slug 
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setUploading(true);
    const files = Array.from(e.target.files);
    const data = new FormData();
    files.forEach(f => data.append("files", f));

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.urls) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...result.urls] }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const toggleMaterial = (mat: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(mat)
        ? prev.materials.filter(m => m !== mat)
        : [...prev.materials, mat]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: formData.price_on_request ? null : parseFloat(formData.price),
    };

    try {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-bg-primary border border-border px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";
  const labelClass = "block text-[10px] tracking-widest uppercase text-text-muted mb-1.5 font-semibold";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-bg-secondary border border-border shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-serif text-xl text-cream">{product ? "Edit Masterpiece" : "Add New Piece"}</h2>
              <button onClick={onClose} className="p-2 text-text-muted hover:text-cream transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>Product Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={handleTitleChange}
                    required 
                    className={inputClass} 
                    placeholder="e.g. Emerald River Dining Table" 
                  />
                </div>
                <div>
                  <label className={labelClass}>Slug (URL Key)</label>
                  <input 
                    type="text" 
                    value={formData.slug} 
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={inputClass}
                  >
                    {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Short Description (Grid View)</label>
                  <input 
                    type="text" 
                    value={formData.short_description} 
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    className={inputClass} 
                    placeholder="Brief 1-sentence hook..." 
                  />
                </div>
                <div>
                  <label className={labelClass}>Full Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4} 
                    className={inputClass} 
                    placeholder="Detailed story and craftsmanship details..." 
                  />
                </div>
              </div>

              {/* Price & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                  <label className={labelClass}>Price (INR)</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    disabled={formData.price_on_request}
                    className={`${inputClass} disabled:opacity-30`} 
                    placeholder="285000" 
                  />
                </div>
                <div className="flex items-center gap-2 pb-3">
                  <input 
                    type="checkbox" 
                    id="price_on_request"
                    checked={formData.price_on_request}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_on_request: e.target.checked }))}
                    className="w-4 h-4 accent-gold"
                  />
                  <label htmlFor="price_on_request" className="text-xs text-text-secondary cursor-pointer">Price on Request</label>
                </div>
                <div className="flex gap-4 pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))} className="w-4 h-4 accent-gold" />
                    <span className="text-xs text-text-secondary">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.is_sold} onChange={e => setFormData(prev => ({ ...prev, is_sold: e.target.checked }))} className="w-4 h-4 accent-gold" />
                    <span className="text-xs text-text-secondary">Mark as Sold</span>
                  </label>
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-4">
                <label className={labelClass}>Dimensions (inches)</label>
                <div className="grid grid-cols-3 gap-4">
                  <input type="text" placeholder="Length" value={formData.dimensions.length} onChange={e => setFormData(prev => ({ ...prev, dimensions: { ...prev.dimensions, length: e.target.value } }))} className={inputClass} />
                  <input type="text" placeholder="Width" value={formData.dimensions.width} onChange={e => setFormData(prev => ({ ...prev, dimensions: { ...prev.dimensions, width: e.target.value } }))} className={inputClass} />
                  <input type="text" placeholder="Height" value={formData.dimensions.height} onChange={e => setFormData(prev => ({ ...prev, dimensions: { ...prev.dimensions, height: e.target.value } }))} className={inputClass} />
                </div>
              </div>

              {/* Materials Multi-Select */}
              <div className="space-y-6">
                <label className={labelClass}>Materials Used</label>
                <div className="space-y-6">
                  {Object.entries(EPOXY_MATERIALS).map(([category, items]) => (
                    <div key={category} className="space-y-3">
                      <p className="text-[9px] tracking-widest uppercase text-gold/60 font-bold">{category}</p>
                      <div className="flex flex-wrap gap-2">
                        {items.map(item => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleMaterial(item)}
                            className={`px-3 py-1.5 text-[10px] tracking-widest uppercase border transition-all ${
                              formData.materials.includes(item)
                                ? "bg-gold text-bg-primary border-gold"
                                : "border-border text-text-muted hover:border-gold/30 hover:text-text-secondary"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <label className={labelClass}>Product Gallery</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {formData.images.map((url, i) => (
                    <div key={i} className="relative aspect-square border border-border group overflow-hidden bg-bg-primary">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1.5 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="relative aspect-square border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all">
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    {uploading ? <Loader2 className="w-5 h-5 text-gold animate-spin" /> : <Plus className="w-5 h-5 text-text-muted" />}
                    <span className="text-[8px] tracking-widest uppercase text-text-muted mt-2">Upload</span>
                  </label>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="p-6 border-t border-border flex justify-end gap-4 bg-bg-secondary">
              <button onClick={onClose} className="px-6 py-2.5 text-xs tracking-widest uppercase text-text-muted hover:text-cream transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                form="product-form"
                disabled={loading}
                className="btn-luxury btn-gold px-8 py-2.5 text-xs flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {product ? "Update Piece" : "Save Piece"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
