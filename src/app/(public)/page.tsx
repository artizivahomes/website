"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import HeroCarousel from "@/components/ui/HeroCarousel";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import {
  FEATURED_PRODUCTS,
  PRODUCTS,
  TESTIMONIALS,
  STATS,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
} from "@/lib/constants";

interface InstagramPost {
  id: string;
  image_url: string;
  post_url: string;
  caption: string;
}

export default function HomePage() {
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [loadingIg, setLoadingIg] = useState(true);

  useEffect(() => {
    async function fetchIgPosts() {
      try {
        const res = await fetch("/api/instagram/posts");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setInstagramPosts(data.slice(0, 6));
        } else {
          // Fallback if table is empty
          const fallback = PRODUCTS.slice(0, 6).map(p => ({
            id: p.id,
            image_url: p.images[0],
            post_url: INSTAGRAM_URL,
            caption: p.title
          }));
          setInstagramPosts(fallback);
        }
      } catch (err) {
        console.error("Failed to fetch IG posts:", err);
      } finally {
        setLoadingIg(false);
      }
    }
    fetchIgPosts();
  }, []);

  return (
    <>
      {/* ... rest of the component remains same ... */}
      {/* ===== HERO CAROUSEL ===== */}
      <HeroCarousel />

      {/* ===== BRAND STORY ===== */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        {/* Subtle resin gradient bg */}
        <div className="absolute inset-0 resin-gradient opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block">
                Our Story
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-cream leading-tight mb-6">
                Where Nature Meets
                <br />
                <span className="gold-text">Artistry</span>
              </h2>
              <div className="w-16 h-0.5 gold-gradient mb-8" />
              <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-6">
                Founded in 2023 by{" "}
                <span className="text-cream font-medium">Shubham Jhawar</span> &{" "}
                <span className="text-cream font-medium">Riya Agarwal</span> — a
                husband-wife duo united by their passion for transforming raw timber
                and flowing resin into functional masterpieces.
              </p>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8">
                Every piece at Artiziva Homes is a one-of-one creation, handcrafted
                in our Siliguri studio. We believe furniture should tell a story —
                of the wood&apos;s journey, the resin&apos;s flow, and the hands that
                shaped it into art.
              </p>
              <Link
                href="/team"
                className="btn-luxury btn-outline inline-flex items-center group"
              >
                Meet the Makers
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Image Collage */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden border border-border-gold">
                    <Image
                      src="/images/products/emerald-dining-table.png"
                      alt="Emerald resin flowing through walnut dining table"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden border border-border-gold">
                    <Image
                      src="/images/products/artisanal-wall-clock.jpg"
                      alt="Handcrafted resin and wood wall clock"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="pt-8 space-y-4">
                  <div className="relative aspect-square overflow-hidden border border-border-gold">
                    <Image
                      src="/images/products/coffee-table.jpg"
                      alt="Blue-green resin river coffee table"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden border border-border-gold">
                    <Image
                      src="/images/products/earth-water-air-fire-wall-frames.jpg"
                      alt="Four elements resin wall art frames"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-gold/20 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-gold/20 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="border-y border-border bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-serif text-3xl md:text-4xl gold-text mb-1">
                  {stat.value}
                </p>
                <p className="text-text-secondary text-xs tracking-[0.15em] uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="Curated Selection"
            title="Featured Masterpieces"
            description="Each piece is a unique conversation between raw timber and flowing resin, handcrafted to perfection in our Siliguri studio."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {FEATURED_PRODUCTS.slice(0, 6).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/shop" className="btn-luxury btn-outline group">
              View Full Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== CRAFTSMANSHIP BANNER ===== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/products/showroom-tables.png"
            alt="Artiziva Homes showroom with multiple resin furniture pieces"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/90 to-bg-primary/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-8 h-8 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-5xl text-cream mb-6 leading-tight">
              Every Piece Tells
              <br />a Story
            </h2>
            <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              From selecting the perfect slab of timber to the final resin pour,
              each creation takes 4-8 weeks of meticulous handcrafting. No two
              pieces are ever the same.
            </p>
            <Link href="/contact" className="btn-luxury btn-gold">
              Commission Your Piece
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 md:py-32 px-6 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="Client Voices"
            title="What Our Clients Say"
            description="Trusted by discerning homeowners, interior designers, and art collectors across India."
          />
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* ===== INSTAGRAM GALLERY TEASER ===== */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="Follow Our Journey"
            title="From Our Studio"
            description={`See our latest creations and behind-the-scenes on Instagram ${INSTAGRAM_HANDLE}`}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {instagramPosts.map((post, i) => (
              <motion.a
                key={post.id}
                href={post.post_url || INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative aspect-square overflow-hidden group"
              >
                <Image
                  src={post.image_url}
                  alt={post.caption || "Artiziva Homes Instagram"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold text-sm tracking-widest hover:text-gold-light transition-colors"
            >
              {INSTAGRAM_HANDLE} →
            </a>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">
              Ready to Own a Masterpiece?
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Let us create something extraordinary for your space.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="btn-luxury btn-gold">
                Shop Collection
              </Link>
              <Link href="/contact" className="btn-luxury btn-outline">
                Custom Enquiry
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
