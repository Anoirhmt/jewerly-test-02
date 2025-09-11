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
    <section className="py-20 bg-gray-50">
      <section className="container mx-auto px-6">
        <header className="text-center mb-16">
          <h2 className="text-4xl font-serif font-light mb-6 text-black">PROMO DE LA SEMAINE</h2>

        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {promos.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </section>
    </section>
  )
}

export function CheckoutSummary() {
  const { items } = useCart()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <Card>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-12 h-12 object-cover rounded" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
        </div>

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {subtotal < 50 && (
          <p className="text-sm text-gray-600">Add {formatPrice(50 - subtotal)} more for free shipping!</p>
        )}
      </CardContent>
    </Card>
  )
}

// Remove misplaced global promos state
