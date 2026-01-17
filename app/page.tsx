"use client";

import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FeaturedCategories } from "@/components/featured-categories";
import { products as baseProducts } from "@/data/products";
import { managementProducts } from "@/data/management-products";
import { collectionProducts } from "@/data/collection-products";
import { promoProducts } from "@/data/promo-products";

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

      {/* CONTINUATION OF THE PAGE */}
      <div className="relative z-30 bg-white">
        <ScrollReveal>
          <FeaturedCategories />
        </ScrollReveal>

        <section className="py-32 bg-white text-black">
          <div className="w-full px-6 text-center">
            <ScrollReveal direction="up" distance={30}>
              <span className="text-[10px] tracking-[0.5em] uppercase text-gray-500 mb-8 block">
                Notre Philosophie
              </span>
              <h2 className="text-luxury-md w-full mx-auto mb-12 leading-relaxed italic text-black">
                "La joaillerie n'est pas seulement un ornement, c'est le reflet d'une âme, 
                le souvenir d'un instant, la promesse d'un futur."
              </h2>
              <div className="w-12 h-[1px] bg-black/30 mx-auto" />
            </ScrollReveal>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="w-full px-4">
            <ScrollReveal>
              <h2 className="text-luxury text-center mb-16 tracking-[0.4em] text-black">
                NOS PACKS ET COLLECTION
              </h2>
            </ScrollReveal>
            <ProductGrid products={products} showNavCards />
          </div>
        </section>
      </div>
    </main>
  );
}
