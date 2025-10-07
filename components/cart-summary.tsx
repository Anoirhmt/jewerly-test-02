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
    return <div>Chargement...</div>
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
        <CardTitle className="font-serif text-2xl font-medium text-black">Récapitulatif de la commande</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-4">
          <p className="flex justify-between font-light">
            <span className="text-gray-700">Sous-total</span>
            <span className="text-black">{formatPrice(subtotal)}</span>
          </p>

          <Separator className="bg-gray-200" />

{/* removed total price paragraph */}
        </section>

        <Link href={total > 0 ? "/checkout" : "#"}>
          <Button 
            className="w-full bg-black hover:bg-gray-900 text-white border-0 py-4 text-sm tracking-wider font-medium rounded-none transition duration-300 ease-in-out shadow-[0_0_8px_rgba(0,0,0,0.35)] hover:shadow-[0_0_15px_rgba(0,0,0,0.6)]"
            disabled={total <= 0}
          >
            {total <= 0 ? "AJOUTER DES ARTICLES" : "ACHETER MAINTENANT"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
