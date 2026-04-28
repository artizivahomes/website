"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export default function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCat, setNewCat] = useState({ name: "", slug: "", description: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async () => {
    if (!newCat.name || !newCat.slug) return;
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });
      if (res.ok) {
        setNewCat({ name: "", slug: "", description: "" });
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (cat: Category) => {
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      if (res.ok) {
        setEditingId(null);
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This may affect products in this category.")) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" /></div>;

  const inputClass = "bg-bg-primary border border-border px-3 py-1.5 text-sm text-cream focus:border-gold outline-none w-full";

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-cream">Product Categories</h2>
        <p className="text-text-muted text-sm">Manage dynamic product categories</p>
      </div>

      {/* Add New Category */}
      <div className="bg-bg-secondary border border-border p-6 space-y-4">
        <h3 className="text-[10px] tracking-widest uppercase text-gold font-bold">Add New Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            placeholder="Category Name" 
            className={inputClass}
            value={newCat.name}
            onChange={e => setNewCat(prev => ({ ...prev, name: e.target.value, slug: slugify(e.target.value) }))}
          />
          <input 
            placeholder="Slug" 
            className={inputClass}
            value={newCat.slug}
            onChange={e => setNewCat(prev => ({ ...prev, slug: slugify(e.target.value) }))}
          />
          <div className="md:col-span-2">
            <textarea 
              placeholder="Description (Optional)" 
              className={inputClass}
              value={newCat.description}
              onChange={e => setNewCat(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </div>
        <button 
          onClick={handleAdd}
          disabled={saving || !newCat.name}
          className="btn-luxury btn-gold px-6 py-2 text-xs flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-bg-secondary border border-border p-4 flex items-center justify-between group">
            {editingId === cat.id ? (
              <div className="flex-1 grid grid-cols-2 gap-4 mr-4">
                <input 
                  className={inputClass}
                  value={cat.name}
                  onChange={e => setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, name: e.target.value } : c))}
                />
                <input 
                  className={inputClass}
                  value={cat.slug}
                  onChange={e => setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, slug: slugify(e.target.value) } : c))}
                />
              </div>
            ) : (
              <div className="flex-1">
                <h4 className="text-cream font-medium">{cat.name}</h4>
                <p className="text-[10px] text-text-muted uppercase tracking-widest">slug: {cat.slug}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {editingId === cat.id ? (
                <>
                  <button onClick={() => handleUpdate(cat)} className="p-2 text-gold hover:bg-gold/10 rounded-full transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-2 text-text-muted hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditingId(cat.id)} className="p-2 text-text-muted hover:text-gold transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-text-muted hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
