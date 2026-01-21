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
                &quot;La joaillerie n&apos;est pas seulement un ornement, c&apos;est le reflet d&apos;une âme,
                le souvenir d&apos;un instant, la promesse d&apos;un futur.&quot;
              </h2>
              <div className="w-12 h-[1px] bg-black/30 mx-auto" />
            </ScrollReveal>
          </div>
        </section>

        <section className="py-24 bg-luxury-cream/30">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-serif mb-8 tracking-widest uppercase">Elarain Jewelry & Watches</h2>
              <p className="text-sm leading-relaxed text-gray-600 mb-6 font-light">
                Bienvenue sur <strong>Elarain Jewelry</strong>, votre destination de prestige pour la joaillerie de luxe et l&apos;horlogerie d&apos;exception.
                Que vous recherchiez une <strong>montre Elarain</strong> sophistiquée, des colliers étincelants ou des accessoires qui redéfinissent l&apos;élégance,
                notre <strong>shop Elarain</strong> vous propose des pièces uniques conçues pour durer.
              </p>
              <p className="text-sm leading-relaxed text-gray-600 font-light">
                Depuis la création de notre <strong>site Elarain</strong>, nous nous engageons à offrir l&apos;excellence à travers chaque bijou.
                Explorez l&apos;univers <strong>Elarain Jewelry</strong> et laissez-vous séduire par l&apos;éclat suprême de nos collections.
              </p>
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
