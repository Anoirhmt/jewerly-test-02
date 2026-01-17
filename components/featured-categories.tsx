'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gem, Heart, Star, Crown } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/utils/format-price"
import React from "react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/data/products"
import { promoProducts } from "@/data/promo-products"

export function FeaturedCategories() {
  const categories = [
    {
      name: "Luxury Bracelets",
      description: "Elegant bracelets inspired by prestigious jewelry houses",
      icon: Crown,
      href: "/products",
      color: "bg-black",
    },
    {
      name: "Diamond Collection",
      description: "Sparkling pieces with premium crystal accents",
      icon: Gem,
      href: "/products",
      color: "bg-gray-800",
    },
    {
      name: "Jewelry Packs",
      description: "Curated sets for the perfect layered look",
      icon: Heart,
      href: "/packs",
      color: "bg-gray-700",
    },
    {
      name: "Premium Selection",
      description: "Our most exclusive and sought-after pieces",
      icon: Star,
      href: "/products",
      color: "bg-gray-900",
    },
  ]

  const promos = promoProducts.filter(promo => promo.inStock && promo.name)

  return (
    <section className="py-24 bg-white">
      <div className="w-full px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-4 block">Offres Spéciales</span>
          <h2 className="text-3xl font-serif font-medium text-black tracking-luxury uppercase italic">Promotions de la Semaine</h2>
          <div className="w-12 h-[1px] bg-black mt-8" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {promos.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
