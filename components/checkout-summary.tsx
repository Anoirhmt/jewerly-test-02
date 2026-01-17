"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/utils/format-price"
import Image from "next/image"

export function CheckoutSummary() {
  const { items } = useCart()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle>Récapitulatif de la commande</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <section className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded overflow-hidden">
                <Image
                  src={item.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNGOEY4RjgiLz48L3N2Zz4="}
                  alt={item.name}
                  fill
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="object-cover select-none"
                />
              </div>
              <section className="flex-1">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <p className="text-gray-600 text-sm">Qté : {item.quantity}</p>
              </section>
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            </article>
          ))}
        </section>

        <Separator />

        {/* Pricing Breakdown */}
        <section className="space-y-2">
          <p className="flex justify-between">
            <span>Sous-total</span>
            <span>{formatPrice(subtotal)}</span>
          </p>

          <p className="flex justify-between">
            <span>Livraison</span>
            <span>{formatPrice(shipping)}</span>
          </p>

          <p className="flex justify-between">
            <span>Taxes</span>
            <span>{formatPrice(tax)}</span>
          </p>
        </section>

        <Separator />

        <p className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </p>

        {subtotal < 50 && (
          <p className="text-sm text-gray-600">Ajoutez {formatPrice(50 - subtotal)} de plus pour la livraison gratuite !</p>
        )}
      </CardContent>
    </Card>
  )
}
