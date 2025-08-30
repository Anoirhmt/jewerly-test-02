"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/utils/format-price"
import Link from "next/link"

export function CartSummary() {
  const { items, isLoading } = useCart()

  if (isLoading) {
    return <div>Loading...</div>
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 15.99
  const total = subtotal + deliveryFee

  if (items.length === 0) {
    return null
  }

  return (
    <Card className="border-0 premium-shadow bg-white">
      <CardHeader className="pb-6">
        <CardTitle className="font-serif text-2xl font-medium text-black">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-4">
          <p className="flex justify-between font-light">
            <span className="text-gray-700">Subtotal</span>
            <span className="text-black">{formatPrice(subtotal)}</span>
          </p>

          <Separator className="bg-gray-200" />

          <p className="flex justify-between text-xl font-serif font-medium">
            <span className="text-black">Total</span>
            <span className="text-black">{formatPrice(total)}</span>
          </p>
        </section>



        <aside className="bg-gray-50 p-4 border border-gray-200 rounded-none">
          <p className="text-sm text-gray-700 font-light">
            💰 <strong>Cash on Delivery:</strong> Pay when your jewelry arrives at your doorstep. No advance payment
            required.
          </p>
        </aside>

        <Link href={total > 0 ? "/checkout" : "#"}>
          <Button 
            className="w-full bg-black hover:bg-gray-900 text-white border-0 py-4 text-sm tracking-wider font-medium rounded-none"
            disabled={total <= 0}
          >
            {total <= 0 ? "AJOUTER DES ARTICLES" : "PROCEED TO CHECKOUT"}
          </Button>
        </Link>

        <Link href="/products">
          <Button
            variant="outline"
            className="w-full bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 rounded-none py-4 text-sm tracking-wider font-light"
          >
            CONTINUE SHOPPING
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
