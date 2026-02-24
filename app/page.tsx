"use client";

import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FeaturedCategories } from "@/components/featured-categories";
import { products as baseProducts } from "@/data/products";
import { managementProducts } from "@/data/watche-products";
import { collectionProducts } from "@/data/collection-products";
import { promoProducts } from "@/data/promo-products";
import { motion } from "framer-motion";

const PILLARS = [
  { num: "01", title: "Savoir-Faire", body: "Chaque pièce est façonnée à la main par des artisans d'exception, héritiers d'un siècle de tradition joaillière." },
  { num: "02", title: "Matières Nobles", body: "Nous sélectionnons uniquement les métaux et pierres de plus haute qualité — pour un éclat qui traverse le temps." },
  { num: "03", title: "Éternité", body: "Nos créations transcendent les saisons. Ce sont des objets de mémoire, portés de génération en génération." },
];

const MARQUEE_ITEMS = [
  "Joaillerie d'Exception",
  "Livraison Express",
  "Matériaux Premium",
  "Paiement à la Livraison",
  "Service Personnalisé",
  "Créations Exclusives",
];

export default function HomePage() {
  const products = [
    ...baseProducts,
    ...managementProducts,
    ...collectionProducts,
    ...promoProducts,
  ].filter((p) => p.name && !p.isPack);

  return (
    <main className="bg-white text-black">
      <Hero />

      <div className="relative z-30 bg-white">

        {/* ── BRAND MARQUEE STRIP ── */}
        <div className="w-full overflow-hidden border-y border-black/[0.04] py-3.5 bg-white">
          <div className="flex items-center marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-4 shrink-0 px-5 sm:px-8 text-[7px] sm:text-[8px] tracking-[0.4em] uppercase text-black/30 font-light"
              >
                {item}
                <span className="w-1 h-1 rounded-full bg-[#9b5c5c]/30 shrink-0" />
              </span>
            ))}
          </div>
        </div>

        {/* ── EXCLUSIVE SELECTIONS ── */}
        <ScrollReveal>
          <FeaturedCategories />
        </ScrollReveal>

        {/* ── PHILOSOPHY ── */}
        <section className="py-16 sm:py-24 md:py-28 bg-white">
          <div className="w-full px-4 sm:px-6 md:px-16">
            <ScrollReveal direction="up" distance={20}>
              <div className="text-center mb-10 sm:mb-16">
                <span className="text-[8px] tracking-[0.5em] uppercase text-[#9b5c5c] mb-3 block font-medium">
                  Notre Philosophie
                </span>
              </div>
            </ScrollReveal>

            {/* Quote */}
            <ScrollReveal direction="up" distance={16}>
              <div className="text-center mt-6 sm:mt-10 px-6">
                <blockquote className="font-serif text-lg sm:text-xl md:text-3xl italic text-black/50 leading-relaxed max-w-2xl mx-auto">
                  &ldquo;La joaillerie n&apos;est pas seulement un ornement,&nbsp;
                  c&apos;est le reflet d&apos;une âme.&rdquo;
                </blockquote>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── COLLECTIONS GRID ── */}
        <section className="pb-16 sm:pb-24 md:pb-28 bg-[#F9F7F5]">
          <div className="w-full px-3 sm:px-4 md:px-8 pt-12 sm:pt-16 md:pt-20">
            <ProductGrid products={products} showNavCards />
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section className="relative overflow-hidden bg-[#1C1C1E] py-16 sm:py-20 md:py-24 px-5 text-center">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center gap-6 sm:gap-8"
          >
            <span className="text-[8px] tracking-[0.5em] uppercase text-[#9b5c5c] font-medium">
              Elarain Jewelry
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl tracking-luxury uppercase text-white font-medium leading-tight max-w-xs sm:max-w-lg">
              Portez l&apos;Excellence
            </h2>
            <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 font-light">
              Chaque bijou, une promesse d'éternité
            </p>
            {/* Touch-friendly CTA */}
            <a
              href="/products"
              className="mt-1 inline-flex items-center justify-center bg-white text-black text-[9px] tracking-[0.4em] uppercase font-medium px-10 py-4 sm:px-12 sm:py-5 transition-all duration-500 active:bg-white/90 hover:bg-white/90"
            >
              Explorer la Collection
            </a>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
