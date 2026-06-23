"use client"
import React, { useState, useEffect, useCallback } from "react";
//import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
//import { HERO_SLIDES } from "@/data/siteData";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_SLIDES } from "@/data/siteData";
import Link from "next/link";

export default function HeroCarousel() {
    
    
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = HERO_SLIDES[current];

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-xl"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                {slide.headline}
              </h1>
              <p className="mt-4 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
                {slide.subheadline}
              </p>
             <Link
                    href={slide.ctaLink || "#"} // <-- Add the fallback here
                    className="mt-6 md:mt-8 inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm sm:text-base transition-colors duration-200 shadow-lg"
                    >
                    {slide.cta || "Learn More"}
                    <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
             </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors text-white"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors text-white"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-amber-500"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}