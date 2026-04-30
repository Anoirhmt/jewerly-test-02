"use client";

import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { ScrollReveal } from "@/components/scroll-reveal";
import { products as baseProducts } from "@/data/products";
import { managementProducts } from "@/data/watche-products";
import { collectionProducts } from "@/data/collection-products";
import { motion } from "framer-motion";

const MARQUEE_ITEMS = [
  "Joaillerie d'Exception",
  "✦",
  "Livraison Express",
  "✦",
  "Matériaux Premium",
  "✦",
  "Paiement à la Livraison",
  "✦",
  "Service Personnalisé",
  "✦",
  "Créations Exclusives",
  "✦",
];

export default function HomePage() {
  const products = [
    ...baseProducts,
    ...managementProducts,
    ...collectionProducts,
  ].filter((p) => p.name && !p.isPack);

  return (
    <main className="bg-white text-black">
      <Hero />

      <div className="relative z-30">

        {/* ── MARQUEE — dark gold strip ── */}
        <div className="w-full overflow-hidden bg-[#0E0E0E] py-4 border-y border-[#c5a367]/10">
          <div className="flex items-center marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                className="shrink-0 px-6 text-[7px] sm:text-[8px] tracking-[0.45em] uppercase font-light"
                style={{ color: item === "✦" ? "#c5a367" : "rgba(255,255,255,0.35)" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── PHILOSOPHY ── */}
        <section className="bg-white py-14 sm:py-24 md:py-36 px-5 sm:px-12 md:px-20">
          <div className="max-w-7xl mx-auto">

            {/* Mobile: stacked centered | Desktop: 2-col split */}
            <div className="flex flex-col items-center text-center md:grid md:grid-cols-2 md:items-center md:text-left md:gap-20">

              {/* Left */}
              <ScrollReveal direction="up" distance={24}>
                <div className="flex flex-col items-center md:items-start gap-5 mb-10 md:mb-0">
                  <span className="text-[7px] tracking-[0.6em] uppercase text-[#9b5c5c] font-medium">
                    Notre Philosophie
                  </span>
                  <div className="w-6 h-[1px] bg-[#9b5c5c]/40" />
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-black leading-snug font-medium">
                    L&apos;Art du<br />
                    <span className="italic font-normal text-black/40">Bijou Éternel</span>
                  </h2>
                </div>
              </ScrollReveal>

              {/* Right */}
              <ScrollReveal direction="up" distance={24}>
                <div className="flex flex-col items-center md:items-start gap-6">
                  <blockquote className="font-serif text-lg sm:text-xl md:text-2xl italic text-black/40 leading-relaxed border-l border-[#9b5c5c]/25 pl-5 text-left">
                    &ldquo;La joaillerie n&apos;est pas seulement un ornement,
                    c&apos;est le reflet d&apos;une âme.&rdquo;
                  </blockquote>
                  <p className="text-[9px] tracking-[0.25em] uppercase text-black/25 font-light leading-loose max-w-sm">
                    Chaque création est pensée pour traverser le temps — façonnée avec précision, portée avec grâce.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-[1px] bg-[#c5a367]/60" />
                    <span className="text-[7px] tracking-[0.5em] uppercase text-[#c5a367] font-medium">
                      Elarain Jewelry
                    </span>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* ── COLLECTIONS — with elegant header ── */}
        <section className="bg-[#F9F7F5] pt-14 sm:pt-20 pb-16 sm:pb-24 md:pb-32">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center px-4 mb-12 sm:mb-16"
          >
            <span className="text-[7px] tracking-[0.6em] uppercase text-[#9b5c5c] font-medium block mb-4">
              Nos Univers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-black font-medium tracking-luxury uppercase">
              La Collection
            </h2>
            <div className="flex items-center justify-center gap-4 mt-5">
              <div className="w-12 h-[0.5px] bg-[#9b5c5c]/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#c5a367]/50" />
              <div className="w-12 h-[0.5px] bg-[#9b5c5c]/30" />
            </div>
          </motion.div>

          <div className="w-full px-3 sm:px-4 md:px-8">
            <ProductGrid products={products} showNavCards />
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section className="relative overflow-hidden bg-[#0a0a0a] min-h-[70vh] flex items-center">

          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: "url('/cta-bg.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />
            {/* Subtle gold vignette */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(197,163,103,0.05) 0%, transparent 70%)" }} />
          </div>

          {/* Gold top line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#c5a367]/40 via-[#c5a367]/10 to-transparent z-10" />

          {/* Content — centered on mobile, left on desktop */}
          <div className="relative z-10 w-full px-6 sm:px-12 md:px-24 py-20 sm:py-28 md:py-32 flex flex-col items-center text-center md:items-start md:text-left">
            <div className="max-w-lg w-full">

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-center md:justify-start gap-4 mb-8"
              >
                <div className="w-8 h-[0.5px] bg-[#c5a367]" />
                <span className="text-[7px] tracking-[0.6em] uppercase text-[#c5a367] font-medium">
                  Elarain Jewelry
                </span>
                <div className="w-8 h-[0.5px] bg-[#c5a367] md:hidden" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif leading-tight mb-5"
              >
                <span className="block italic font-light text-white text-4xl sm:text-5xl md:text-7xl">
                  Portez
                </span>
                <span className="block font-semibold text-white text-3xl sm:text-4xl md:text-6xl tracking-wide">
                  L&apos;Excellence
                </span>
              </motion.h2>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3 }}
                style={{ originX: 0.5 }}
                className="h-[1px] w-12 bg-[#c5a367] mx-auto md:mx-0 mb-6 mt-2"
              />

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-[9px] tracking-[0.4em] uppercase text-white/35 font-light mb-10"
              >
                Chaque bijou, une promesse d&apos;éternité
              </motion.p>

              <motion.a
                href="/products"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="group inline-flex items-center justify-center gap-4 border border-[#c5a367]/50 text-[#c5a367] active:bg-[#c5a367] active:text-black hover:bg-[#c5a367] hover:text-black transition-all duration-700 w-full sm:w-auto px-10 py-4 text-[8px] tracking-[0.5em] uppercase font-medium"
              >
                <span>Explorer la Collection</span>
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </motion.a>
            </div>
          </div>

          {/* Gold bottom line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#c5a367]/40 via-[#c5a367]/10 to-transparent z-10" />
        </section>

      </div>
    </main>
  );
}
