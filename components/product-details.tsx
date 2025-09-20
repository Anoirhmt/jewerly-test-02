"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent } from "@/components/ui/drawer"

import { ShoppingCart, Minus, Plus } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/utils/format-price"
import type { Product } from "@/data/products"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem, items } = useCart()
  const router = useRouter()

  const [isDrawerOpen, setDrawerOpen] = useState(false)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    setDrawerOpen(true)
  }

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    router.push("/checkout")
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4 max-w-md mx-auto lg:mx-0">
          <div
            className="aspect-square overflow-hidden rounded-lg border border-gray-200 select-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
          >
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              style={{ WebkitUserDrag: "none" }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-serif font-semibold uppercase tracking-wide mb-3 text-black">{product.name}</h1>
            <div className="mb-4">
              {product.inStock ? (
                <Badge className="bg-green-100 text-green-800 border-0">
                  En stock
                </Badge>
              ) : (
                <Badge variant="destructive" className="border-0">
                  En rupture de stock
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-black">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                <Badge className="bg-green-100 text-green-800 border-0">Économisez {discountPercentage}%</Badge>
              </>
            )}
          </div>

          {product.material && (
            <div className="space-y-1">
              <p className="text-gray-700 font-medium">Matériau</p>
              <p className="text-gray-600">{product.material}</p>
            </div>
          )}

          {product.gemstone && (
            <div className="space-y-1">
              <p className="text-gray-700 font-medium">Pierre précieuse</p>
              <p className="text-gray-600">{product.gemstone}</p>
            </div>
          )}

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="font-medium">Quantité:</span>
            <div className="flex items-center border border-gray-300">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="rounded-none"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-6 py-2 font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} className="rounded-none">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleBuyNow}
              className="flex-1 bg-white text-black border border-black px-4 py-2 font-semibold tracking-wide rounded-none uppercase transition-all duration-300 hover:bg-gray-100 hover:scale-105"
              size="lg"
              disabled={!product.inStock}
            >
              Acheter maintenant
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-black hover:bg-gray-900 text-white rounded-none transform transition-transform duration-500 ease-in-out hover:scale-105 text-lg py-4 sm:text-base sm:py-2"
              size="lg"
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ajouter au panier
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="p-4">
          <h2 className="text-lg font-semibold">Récapitulatif du panier</h2>
          <ul className="mt-2 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500 text-xs">Qté : {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4 font-medium">
            <span>Sous-total:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Button onClick={() => router.push('/checkout')} className="mt-4 w-full">
            Passer à la caisse
          </Button>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link href="/cart">
              <Button variant="outline" className="w-full rounded-none">
                Voir le panier
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="ghost" className="w-full rounded-none">
                Continuer vos achats
              </Button>
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
