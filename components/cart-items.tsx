"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/utils/format-price"
import Link from "next/link"

export function CartItems() {
  const { items, updateQuantity, removeItem, isLoading } = useCart()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <article className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
              />

              <header className="flex-1 min-w-[140px]">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-semibold text-base hover:text-primary transition-colors">{item.name}</h3>
                </Link>
                <p className="text-gray-500 text-sm">{formatPrice(item.price)}</p>
              </header>

              <section className="flex items-center space-x-2 mt-1 sm:mt-0" aria-label="Quantity controls">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                  className="h-8 w-8"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium text-sm" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity" className="h-8 w-8">
                  <Plus className="h-3 w-3" />
                </Button>
              </section>

              <div className="w-full sm:w-24 text-right whitespace-nowrap mt-1 sm:mt-0">
                <p className="font-semibold text-base">{formatPrice(item.price * item.quantity)}</p>
              </div>

              <div className="w-full sm:w-12 text-right mt-1 sm:mt-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 h-8 w-8"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </article>
          </CardContent>
        </Card>
      ))}
    </ul>
  )
}
