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
          <CardContent className="p-6">
            <article className="flex items-center space-x-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <header className="flex-1">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors">{item.name}</h3>
                </Link>
                <p className="text-gray-600">{formatPrice(item.price)}</p>
              </header>

              <section className="flex items-center space-x-2" aria-label="Quantity controls">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                  <Plus className="h-4 w-4" />
                </Button>
              </section>

              <footer className="text-right">
                <p className="font-semibold text-lg">{formatPrice(item.price * item.quantity)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </footer>
            </article>
          </CardContent>
        </Card>
      ))}
    </ul>
  )
}
