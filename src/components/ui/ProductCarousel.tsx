"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
}

export default function ProductCarousel({ products, title }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="relative py-12 group">
      {title && (
        <div className="flex items-center justify-between mb-8 px-6 md:px-0">
          <h2 className="font-serif text-2xl md:text-3xl text-cream tracking-tight">{title}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 border border-gold/20 rounded-full transition-all ${canScrollLeft ? "text-gold hover:bg-gold hover:text-bg-primary" : "text-text-muted opacity-30"}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 border border-gold/20 rounded-full transition-all ${canScrollRight ? "text-gold hover:bg-gold hover:text-bg-primary" : "text-text-muted opacity-30"}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 md:px-0"
      >
        {products.map((product, i) => (
          <div key={product.id} className="min-w-[280px] md:min-w-[350px] snap-start">
            <ProductCard product={product} index={i} />
          </div>
        ))}
        {/* Spacer for ending */}
        <div className="min-w-[20px]" />
      </div>
    </div>
  );
}
