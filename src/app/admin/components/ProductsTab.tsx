"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Check, X, Filter, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import ProductFormModal from "./ProductFormModal";

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [filterCategory]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?category=${filterCategory}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSold(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_sold: !currentStatus }),
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === id ? { ...p, is_sold: !currentStatus } : p));
      }
    } catch (err) {
      console.error("Failed to toggle sold status:", err);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  }

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-cream">Product Inventory</h2>
          <p className="text-text-muted text-sm tracking-widest uppercase mt-1">Manage your masterpieces</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="btn-luxury btn-gold text-xs px-6 py-3 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Piece
        </button>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen} 
        product={editingProduct}
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProducts}
      />

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-secondary border border-border pl-12 pr-4 py-3 text-sm text-cream focus:border-gold outline-none transition-colors"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-bg-secondary border border-border pl-12 pr-4 py-3 text-sm text-cream appearance-none focus:border-gold outline-none transition-colors cursor-pointer"
          >
            <option value="All">All Categories</option>
            {PRODUCT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-bg-secondary border border-border overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-white/5">
              <th className="px-6 py-4 text-[10px] tracking-widest uppercase text-text-muted">Piece</th>
              <th className="px-6 py-4 text-[10px] tracking-widest uppercase text-text-muted">Category</th>
              <th className="px-6 py-4 text-[10px] tracking-widest uppercase text-text-muted">Price</th>
              <th className="px-6 py-4 text-[10px] tracking-widest uppercase text-text-muted">Status</th>
              <th className="px-6 py-4 text-[10px] tracking-widest uppercase text-text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-8 bg-white/2" />
                </tr>
              ))
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-text-muted">
                  No products found. Add your first masterpiece to get started.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 border border-border overflow-hidden bg-bg-primary">
                        {p.images[0] ? (
                          <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted uppercase text-[8px]">No Image</div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-cream">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-text-secondary">{p.category}</td>
                  <td className="px-6 py-4 text-sm text-gold">
                    {p.price_on_request ? "On Request" : p.price ? formatPrice(p.price) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleSold(p.id, p.is_sold)}
                      className={`flex items-center gap-1.5 px-3 py-1 text-[10px] tracking-widest uppercase border transition-colors ${
                        p.is_sold 
                          ? "bg-error/10 border-error/30 text-error" 
                          : "bg-success/10 border-success/30 text-success"
                      }`}
                    >
                      {p.is_sold ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      {p.is_sold ? "Sold" : "Active"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setEditingProduct(p); setIsModalOpen(true); }}
                        className="p-2 text-text-muted hover:text-gold transition-colors" 
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 text-text-muted hover:text-error transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
