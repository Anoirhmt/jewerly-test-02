"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/utils/format-price"

export function CheckoutSummary() {
  const { items } = useCart()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <section className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="flex items-center space-x-3">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-12 h-12 object-cover rounded" />
              <section className="flex-1">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
              </section>
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            </article>
          ))}
        </section>

        <Separator />

        {/* Pricing Breakdown */}
        <section className="space-y-2">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </p>

          <p className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </p>

          <p className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </p>
        </section>

        <Separator />

        <p className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </p>

        {subtotal < 50 && (
          <p className="text-sm text-gray-600">Add {formatPrice(50 - subtotal)} more for free shipping!</p>
        )}
      </CardContent>
    </Card>
  )
}
