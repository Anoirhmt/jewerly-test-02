'use client';

import { ProductGrid } from "@/components/product-grid"
import { ProductCard } from "@/components/product-card"
import { Hero } from "@/components/hero"
import { FeaturedCategories } from "@/components/featured-categories"
import { ScrollReveal } from "@/components/scroll-reveal"

import { products as baseProducts } from "@/data/products"
import { managementProducts } from "@/data/management-products"
import { collectionProducts } from "@/data/collection-products"

import { promoProducts } from "@/data/promo-products"

export default function HomePage() {
  const products = [
    ...baseProducts,
    ...managementProducts,
    ...collectionProducts,
    ...promoProducts,
  ].filter(p => p.name && !p.isPack)

  return (
    <div className="min-h-screen">
      <Hero />
      
      <ScrollReveal>
        <FeaturedCategories />
      </ScrollReveal>
      
      {/* Brand Story Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative aspect-[4/5] overflow-hidden group">
                <img 
                  src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_3687.jpeg" 
                  alt="Craftsmanship" 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-700" />
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="left" delay={0.4}>
              <div className="max-w-xl">
                <h2 className="text-luxury-lg mb-8 leading-tight">L'Art de l'Éternité</h2>
                <p className="text-gray-600 text-lg leading-relaxed-extra mb-8 font-light">
                  Chez Elarain Jewelry, chaque pièce est une symphonie de lumière et de précision. 
                  Inspirées par l'élégance intemporelle et façonnées par des mains expertes, 
                  nos créations transcendent les tendances pour devenir des héritages.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed-extra mb-12 font-light">
                  Nous croyons que le luxe réside dans les détails. De la sélection rigoureuse des matériaux 
                  à la finition miroir, chaque étape est un engagement envers l'excellence.
                </p>
                <div className="w-24 h-[1px] bg-black mb-8" />
                <p className="font-serif italic text-xl text-black">Elarain Jewelry — Votre histoire, notre éclat.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Heritage Quote Section */}
      <section className="py-32 bg-black text-white overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <ScrollReveal direction="up" distance={30}>
            <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-8 block">Notre Philosophie</span>
            <h2 className="text-luxury-md max-w-3xl mx-auto mb-12 leading-relaxed italic">
              "La joaillerie n'est pas seulement un ornement, c'est le reflet d'une âme, le souvenir d'un instant, la promesse d'un futur."
            </h2>
            <div className="w-12 h-[1px] bg-white/30 mx-auto" />
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 cv-auto bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-luxury text-center mb-16 tracking-[0.4em]">NOS PACKS ET COLLECTION</h2>
          </ScrollReveal>
          <ProductGrid products={products} showNavCards />
        </div>
      </section>
    </div>
  )
}
