"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/utils/format-price"
import Link from "next/link"
import Image from "next/image"

export function CartItems() {
  const { items, updateQuantity, removeItem, isLoading } = useCart()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (items.length === 0) {
    return (
      <div className="bg-white p-12 text-center shadow-luxury">
        <h2 className="text-2xl font-serif font-medium mb-4 tracking-luxury uppercase">Votre panier est vide</h2>
        <p className="text-gray-400 mb-8 font-light tracking-widest uppercase text-xs">Découvrez nos collections exclusives</p>
        <Link href="/products">
          <Button className="bg-black text-white px-8 py-6 text-[10px] tracking-[0.3em] rounded-none uppercase transition-all duration-500 hover:bg-gray-900">
            Voir les produits
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <ul className="space-y-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white p-6 shadow-sm border border-gray-50 group transition-all duration-500 hover:shadow-luxury">
          <article className="flex flex-wrap items-center gap-6 sm:flex-nowrap">
            <div className="relative aspect-[4/5] w-24 overflow-hidden bg-gray-50 flex-shrink-0">
              <Image
                src={item.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNGOEY4RjgiLz48L3N2Zz4="}
                alt={item.name}
                fill
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="object-cover transition-transform duration-700 group-hover:scale-105 select-none"
              />
            </div>

            <header className="flex-1 min-w-[140px] space-y-1">
              <Link href={`/products/${item.id}`}>
                <h3 className="font-serif font-medium text-sm tracking-luxury uppercase hover:text-gray-600 transition-colors">{item.name}</h3>
              </Link>
              <p className="text-gray-400 text-[10px] tracking-widest uppercase font-light">{formatPrice(item.price)}</p>
              {(item as any).selectedColor && (
                <p className="text-[9px] text-gray-400 tracking-widest uppercase mt-2">Couleur: {(item as any).selectedColor}</p>
              )}
            </header>

            <section className="flex items-center space-x-4" aria-label="Quantity controls">
              <div className="flex items-center border border-gray-100">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="h-10 w-10 rounded-none hover:bg-transparent"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-xs font-light">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-10 w-10 rounded-none hover:bg-transparent"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </section>

            <div className="w-full sm:w-32 text-right whitespace-nowrap">
              <p className="font-medium text-sm tracking-widest">{formatPrice(item.price * item.quantity)}</p>
            </div>

            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                className="text-gray-300 hover:text-black transition-colors h-10 w-10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </article>
        </div>
      ))}
    </ul>
  )
}
