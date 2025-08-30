"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


import { ShoppingCart, Minus, Plus } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/utils/format-price"
import type { Product } from "@/data/products"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name}(s) added to your cart.`,
    })
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



  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Image */}
      <div className="space-y-4 max-w-md mx-auto lg:mx-0">
        <div className="aspect-square overflow-hidden rounded-none border border-gray-200 select-none" draggable={false} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} onCopy={(e) => e.preventDefault()}>
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
              <Badge variant={product.inStock ? "default" : "destructive"} className="bg-black text-white border-0">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-black">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
              <Badge className="bg-black text-white border-0">Save {discountPercentage}%</Badge>
            </>
          )}
        </div>

        {product.material && (
          <div className="space-y-1">
            <p className="text-gray-700 font-medium">Material</p>
            <p className="text-gray-600">{product.material}</p>
          </div>
        )}

        {product.gemstone && (
          <div className="space-y-1">
            <p className="text-gray-700 font-medium">Gemstone</p>
            <p className="text-gray-600">{product.gemstone}</p>
          </div>
        )}

        <p className="text-gray-600 leading-relaxed">{product.description}</p>

        {/* Quantity Selector */}
        <div className="flex items-center space-x-4">
          <span className="font-medium">Quantity:</span>
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
            className="flex-1 bg-white border border-black text-black hover:bg-gray-100 rounded-none transform transition-transform duration-500 ease-in-out hover:scale-105"
            size="lg"
            disabled={!product.inStock}
          >
            Buy It Now
          </Button>
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-black hover:bg-gray-900 text-white rounded-none transform transition-transform duration-500 ease-in-out hover:scale-105"
            size="lg"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>


      </div>
    </div>
  )
}
