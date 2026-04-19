"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/constants";

type TestimonialCarouselProps = {
  testimonials: Testimonial[];
};

export default function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Decorative quote */}
      <Quote className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 text-gold/20" />

      <div className="text-center px-8 md:px-16 py-8 min-h-[280px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-gold fill-gold"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="font-serif text-xl md:text-2xl text-cream leading-relaxed mb-8 italic">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Attribution */}
            <div>
              <p className="text-gold font-sans text-sm tracking-widest uppercase">
                {t.name}
              </p>
              <p className="text-text-muted text-xs mt-1 tracking-wider">
                {t.location} · {t.product}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={prev}
          className="p-2 border border-border hover:border-gold transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-gold w-6 rounded-sm" : "bg-text-muted/30"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="p-2 border border-border hover:border-gold transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
    </div>
  );
}
