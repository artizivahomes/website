"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Grid, LayoutList } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import ProductCarousel from "@/components/ui/ProductCarousel";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Product } from "@/lib/types";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories")
        ]);
        const [prodData, catData] = await Promise.all([
          prodRes.json(),
          catRes.json()
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        console.error("Failed to fetch shop data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const featuredProducts = useMemo(() => products.filter(p => p.featured), [products]);

  const productsByCategory = useMemo(() => {
    const map: Record<string, Product[]> = {};
    products.forEach(p => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="absolute inset-0 resin-gradient opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading
            subtitle="Our Collection"
            title="Shop Masterpieces"
            description="Each piece is handcrafted, one-of-one. Browse our collection or commission something truly yours."
          />
        </div>
      </section>

      {/* Persistent Category Selector */}
      <section className="sticky top-20 z-40 bg-bg-primary/80 backdrop-blur-md border-y border-border py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-hide gap-8">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-6 py-2 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                selectedCategory === "All" ? "bg-gold text-bg-primary border-gold font-bold" : "border-border text-text-secondary hover:border-gold/50"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-6 py-2 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                  selectedCategory === cat.name ? "bg-gold text-bg-primary border-gold font-bold" : "border-border text-text-secondary hover:border-gold/50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-text-muted text-[10px] tracking-widest uppercase ml-auto">
            <span className="hidden md:inline">{filteredProducts.length} Pieces</span>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
               {selectedCategory === "All" ? <LayoutList className="w-4 h-4 text-gold" /> : <Grid className="w-4 h-4 text-gold" />}
               <span>{selectedCategory === "All" ? "Discovery Mode" : "Grid Mode"}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {selectedCategory === "All" ? (
              <motion.div
                key="discovery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Featured Products Carousel */}
                <ProductCarousel 
                  products={featuredProducts} 
                  title="Featured Masterpieces" 
                />

                {/* Category-wise Carousels */}
                {categories.map(cat => {
                  const catProducts = productsByCategory[cat.name] || [];
                  if (catProducts.length === 0) return null;
                  return (
                    <ProductCarousel 
                      key={cat.id}
                      products={catProducts}
                      title={cat.name}
                    />
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pt-12"
              >
                <div className="mb-12 border-l-2 border-gold pl-6">
                  <h2 className="font-serif text-3xl text-cream mb-2">{selectedCategory}</h2>
                  <p className="text-text-secondary text-sm">Browsing all items in {selectedCategory}</p>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 border border-dashed border-border">
                    <p className="text-text-secondary text-lg font-serif mb-2">No pieces found in this category</p>
                    <button onClick={() => setSelectedCategory("All")} className="text-gold text-xs uppercase tracking-widest hover:text-cream transition-colors">Return to Shop</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
