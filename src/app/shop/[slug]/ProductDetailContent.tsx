"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, MessageSquare, ArrowLeft, Ruler, Layers, Palette } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Product } from "@/lib/constants";

type Props = {
  product: Product;
  relatedProducts: Product[];
};

export default function ProductDetailContent({ product, relatedProducts }: Props) {
  const { addItem } = useCart();

  return (
    <>
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back */}
          <Link href="/shop" className="inline-flex items-center gap-2 text-text-secondary hover:text-gold text-xs tracking-widest uppercase mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="relative aspect-[4/3] overflow-hidden border border-border-gold luxury-shadow-lg">
                <Image src={product.images[0]} alt={product.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
                {product.isSold && (
                  <div className="absolute top-4 left-4 bg-error/90 text-white text-xs tracking-widest uppercase px-4 py-1.5">Sold</div>
                )}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <span className="text-gold text-xs tracking-[0.3em] uppercase">{product.category}</span>
              <h1 className="font-serif text-3xl md:text-4xl text-cream mt-2 mb-3">{product.title}</h1>
              <p className="font-serif text-2xl gold-text mb-6">
                {product.price ? formatPrice(product.price) : "Price on Request"}
              </p>
              <div className="w-12 h-0.5 gold-gradient mb-6" />
              <p className="text-text-secondary text-base leading-relaxed mb-8">{product.description}</p>

              {/* Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 border border-border bg-bg-card">
                  <Ruler className="w-4 h-4 text-gold mb-2" />
                  <p className="text-text-muted text-[10px] tracking-wider uppercase mb-1">Dimensions</p>
                  <p className="text-cream text-sm">{product.dimensions.length} × {product.dimensions.width}</p>
                  <p className="text-text-secondary text-xs">H: {product.dimensions.height}</p>
                </div>
                <div className="p-4 border border-border bg-bg-card">
                  <Layers className="w-4 h-4 text-gold mb-2" />
                  <p className="text-text-muted text-[10px] tracking-wider uppercase mb-1">Materials</p>
                  {product.materials.slice(0, 2).map((m) => (
                    <p key={m} className="text-cream text-sm">{m}</p>
                  ))}
                </div>
                <div className="p-4 border border-border bg-bg-card">
                  <Palette className="w-4 h-4 text-gold mb-2" />
                  <p className="text-text-muted text-[10px] tracking-wider uppercase mb-1">Finish</p>
                  <p className="text-cream text-sm">Hand-Polished</p>
                  <p className="text-text-secondary text-xs">Glass-smooth</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!product.isSold && product.price && (
                  <button onClick={() => addItem(product)} className="btn-luxury btn-gold flex-1 group">
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                )}
                <Link href="/contact" className="btn-luxury btn-outline flex-1 text-center">
                  <MessageSquare className="w-4 h-4" /> {product.priceOnRequest ? "Enquire for Price" : "Customize This Piece"}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-24 px-6 bg-bg-secondary border-t border-border">
          <div className="max-w-7xl mx-auto">
            <SectionHeading subtitle="You May Also Like" title="Related Pieces" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
