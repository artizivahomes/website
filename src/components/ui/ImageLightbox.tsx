"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-[110]">
            <p className="text-text-secondary text-xs tracking-widest uppercase">
              {currentIndex + 1} / {images.length}
            </p>
            <div className="flex items-center gap-4">
              <button onClick={handleZoomOut} className="p-2 text-text-secondary hover:text-gold transition-colors">
                <ZoomOut className="w-5 h-5" />
              </button>
              <button onClick={handleZoomIn} className="p-2 text-text-secondary hover:text-gold transition-colors">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-2 text-text-secondary hover:text-error transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Image Area */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <button 
              onClick={handlePrev}
              className="absolute left-6 z-[110] p-4 bg-white/5 hover:bg-gold hover:text-bg-primary transition-all rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full p-12 flex items-center justify-center cursor-zoom-in"
              style={{ scale }}
              onWheel={(e) => {
                if (e.deltaY < 0) handleZoomIn();
                else handleZoomOut();
              }}
            >
              <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                <Image
                  src={images[currentIndex]}
                  alt="Product view"
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                />
              </div>
            </motion.div>

            <button 
              onClick={handleNext}
              className="absolute right-6 z-[110] p-4 bg-white/5 hover:bg-gold hover:text-bg-primary transition-all rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-2 z-[110]">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`relative w-12 h-12 border transition-all ${
                  currentIndex === i ? "border-gold scale-110" : "border-white/10 opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
