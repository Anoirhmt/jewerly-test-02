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

  if (items.length === 0) {
    return null
  }

  return (
    <Card className="border-0 bg-white shadow-luxury overflow-hidden rounded-none">
      <CardHeader className="pb-8 pt-10 px-8 border-b border-gray-50">
        <CardTitle className="font-serif text-xl font-medium text-black tracking-luxury uppercase">Récapitulatif</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] tracking-[0.2em] uppercase text-gray-500">
            <span>Sous-total</span>
            <span className="font-medium text-black">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between items-center text-[10px] tracking-[0.2em] uppercase text-gray-500 italic">
            <span>Livraison</span>
            <span>Calculée au paiement</span>
          </div>

          <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
            <span className="text-xs tracking-[0.3em] uppercase text-black font-medium">Total Estimé</span>
            <span className="text-2xl font-light text-black tracking-widest">{formatPrice(subtotal)}</span>
          </div>
        </div>

        <Link href="/checkout" className="block">
          <Button
            className="w-full bg-black hover:bg-gray-900 text-white border-0 h-16 text-[10px] tracking-[0.4em] uppercase rounded-none transition-all duration-700 shadow-luxury group relative overflow-hidden"
          >
            <span className="relative z-10">Finaliser la commande</span>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>
        </Link>

        <p className="text-center text-[9px] text-gray-400 tracking-[0.2em] uppercase">
          Taxes incluses. Livraison calculée à l&apos;étape suivante.
        </p>
      </CardContent>
    </Card>
  )
}
