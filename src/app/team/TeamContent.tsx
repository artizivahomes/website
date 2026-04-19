"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Palette, Gem, Users } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const founders = [
  {
    name: "Shubham Jhawar",
    role: "Co-Founder & Visionary Designer",
    image: "/images/team/shubham-placeholder.jpg",
    bio: "With an innate sense for design and a deep appreciation for natural materials, Shubham envisions each piece as a bridge between nature's raw beauty and contemporary luxury living. His eye for proportion, color, and form transforms slabs of timber into sculptural statements that redefine spaces.",
    specialties: ["Design Direction", "Material Selection", "Client Relations"],
    icon: Palette,
  },
  {
    name: "Riya Agarwal",
    role: "Co-Founder & Creative Lead",
    image: "/images/team/riya-placeholder.jpg",
    bio: "Riya brings an artist's soul and a craftsperson's precision to every creation. Her mastery of resin techniques — from ocean-inspired pours to metallic finishes — gives each piece its distinctive character. She leads the creative process from concept sketches to the final polish.",
    specialties: ["Resin Artistry", "Creative Direction", "Quality Assurance"],
    icon: Gem,
  },
];

const artisans = [
  {
    name: "Master Woodworker",
    role: "Timber Specialist",
    description: "25+ years of experience in selecting and preparing premium timber slabs.",
  },
  {
    name: "Resin Technician",
    role: "Epoxy Specialist",
    description: "Expert in advanced resin pouring techniques, pigment mixing, and curing processes.",
  },
  {
    name: "Finishing Artist",
    role: "Surface Specialist",
    description: "Precision sanding, polishing, and protective coating for a flawless finish every time.",
  },
];

export default function TeamContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 resin-gradient opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block">
              The People Behind the Art
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-cream mb-4">
              Meet the <span className="gold-text">Makers</span>
            </h1>
            <div className="w-16 h-0.5 gold-gradient mx-auto mb-6" />
            <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              A husband-wife duo driven by passion for craftsmanship, founded
              Artiziva Homes in 2023 to bring the beauty of resin artistry into
              luxury living spaces across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {founders.map((founder, i) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 last:mb-0 ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Photo */}
              <div className={`relative ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[3/4] overflow-hidden border border-border-gold luxury-shadow-lg">
                  {/* Placeholder gradient since we don't have real photos yet */}
                  <div className="absolute inset-0 bg-gradient-to-br from-bg-elevated via-bg-card to-bg-hover flex items-center justify-center">
                    <div className="text-center">
                      <founder.icon className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                      <p className="text-text-muted text-sm tracking-widest uppercase">
                        Photo Coming Soon
                      </p>
                    </div>
                  </div>
                </div>
                {/* Decorative frame */}
                <div className="absolute -top-3 -left-3 w-full h-full border border-gold/20 -z-10" />
              </div>

              {/* Info */}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <span className="text-gold text-xs tracking-[0.3em] uppercase mb-3 block">
                  Co-Founder
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-cream mb-2">
                  {founder.name}
                </h2>
                <p className="text-gold/70 text-sm tracking-wider uppercase mb-6">
                  {founder.role}
                </p>
                <div className="w-12 h-0.5 gold-gradient mb-6" />
                <p className="text-text-secondary text-base leading-relaxed mb-8">
                  {founder.bio}
                </p>
                <div className="flex flex-wrap gap-3">
                  {founder.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-4 py-1.5 border border-border text-text-secondary text-xs tracking-wider uppercase hover:border-gold hover:text-gold transition-colors duration-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-24 px-6 bg-bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="Our Philosophy"
            title="Craftsmanship is Our Language"
            description="We don't just make furniture. We create heirlooms that carry stories — of ancient timber, of flowing resin, of human hands shaping beauty."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Passion-Driven",
                text: "Every piece begins with love for the craft. We pour our hearts into selecting the perfect timber and envisioning how resin will bring it to life.",
              },
              {
                icon: Palette,
                title: "One-of-One",
                text: "No two pieces are ever the same. Nature provides unique grain patterns, and our resin artistry ensures each creation is a singular masterpiece.",
              },
              {
                icon: Gem,
                title: "Uncompromising Quality",
                text: "From sustainably sourced timber to premium-grade epoxy resin, we use only the finest materials. Every surface is hand-finished to perfection.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-8 border border-border hover:border-border-gold transition-colors duration-500 group"
              >
                <item.icon className="w-8 h-8 text-gold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-serif text-xl text-cream mb-3">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisans */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="The Team"
            title="Our Expert Artisans"
            description="Behind every masterpiece is a team of skilled craftspeople, each a specialist in their domain."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artisans.map((artisan, i) => (
              <motion.div
                key={artisan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 bg-bg-card border border-border hover:border-border-gold transition-all duration-500 group"
              >
                <div className="w-16 h-16 bg-bg-hover border border-border group-hover:border-gold flex items-center justify-center mb-6 transition-colors duration-300">
                  <Users className="w-7 h-7 text-gold/50 group-hover:text-gold transition-colors" />
                </div>
                <h3 className="font-serif text-lg text-cream mb-1">
                  {artisan.name}
                </h3>
                <p className="text-gold/70 text-xs tracking-wider uppercase mb-4">
                  {artisan.role}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {artisan.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">
              Let&apos;s Create Together
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Have a vision for your space? We&apos;d love to bring it to life.
            </p>
            <Link href="/contact" className="btn-luxury btn-gold inline-flex items-center group">
              Start Your Project
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
