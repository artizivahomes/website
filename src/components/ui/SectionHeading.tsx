"use client";

import { motion } from "framer-motion";

type SectionHeadingProps = {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {subtitle && (
        <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3 block">
          {subtitle}
        </span>
      )}
      <h2
        className={`font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide leading-tight ${
          light ? "text-cream" : "text-cream"
        }`}
      >
        {title}
      </h2>
      {/* Gold underline accent */}
      <div
        className={`mt-4 mb-6 ${align === "center" ? "mx-auto" : ""}`}
        style={{ width: "60px", height: "2px" }}
      >
        <div className="w-full h-full gold-gradient" />
      </div>
      {description && (
        <p className="text-text-secondary max-w-2xl text-base md:text-lg leading-relaxed mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}
