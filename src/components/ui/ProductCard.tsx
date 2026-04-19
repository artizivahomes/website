"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/lib/constants";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-bg-card border border-border hover:border-border-gold transition-all duration-500 overflow-hidden luxury-shadow hover:luxury-shadow-lg"
    >
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Badges */}
        {product.isSold && (
          <div className="absolute top-4 left-4 bg-error/90 text-white text-[10px] tracking-widest uppercase px-3 py-1">
            Sold
          </div>
        )}
        {product.featured && !product.isSold && (
          <div className="absolute top-4 left-4 bg-gold/90 text-bg-primary text-[10px] tracking-widest uppercase px-3 py-1">
            Featured
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <Link
            href={`/shop/${product.slug}`}
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-gold hover:border-gold transition-all duration-300 group/btn"
          >
            <Eye className="w-5 h-5 text-white group-hover/btn:text-bg-primary" />
          </Link>
          {!product.isSold && product.price && (
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-gold hover:border-gold transition-all duration-300 group/btn"
              aria-label={`Add ${product.title} to cart`}
            >
              <ShoppingBag className="w-5 h-5 text-white group-hover/btn:text-bg-primary" />
            </button>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <p className="text-gold/70 text-[10px] tracking-[0.2em] uppercase mb-1.5">
          {product.category}
        </p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-serif text-lg text-cream group-hover:text-gold transition-colors duration-300 mb-1.5">
            {product.title}
          </h3>
        </Link>
        <p className="text-text-secondary text-xs leading-relaxed line-clamp-2 mb-3">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-serif text-gold text-lg">
            {product.price ? formatPrice(product.price) : "Price on Request"}
          </span>
          <span className="text-text-muted text-[10px] tracking-wider uppercase">
            {product.materials[0]}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
