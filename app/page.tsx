'use client';

import { ProductGrid } from "@/components/product-grid"
import { ProductCard } from "@/components/product-card"
import { Hero } from "@/components/hero"
import { FeaturedCategories } from "@/components/featured-categories"

import { products as baseProducts } from "@/data/products"
import { managementProducts } from "@/data/management-products"
import { collectionProducts } from "@/data/collection-products"
import { promoProducts } from "@/data/promo-products"
import { packsProducts } from "@/data/packs-products"

export default function HomePage() {
  const products = [
    ...baseProducts,
    ...managementProducts,
    ...collectionProducts,
    ...promoProducts,
    ...packsProducts,
  ].filter(p => p.name)

  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedCategories />
      

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">NOS PACKS ET COLLECTION</h2>
          <ProductGrid products={products} showNavCards />
        </div>
      </section>
    </div>
  )
}
