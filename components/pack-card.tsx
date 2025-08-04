"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Star, Package } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/utils/format-price"
import type { Product } from "@/data/products"

interface PackCardProps {
  product: Product
}

export function PackCard({ product }: PackCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast({
      title: "Pack added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Card className="group hover:premium-shadow transition-all duration-500 border-0 bg-white animate-fade-in">
      <CardContent className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="relative overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <Badge className="absolute top-4 left-4 bg-black text-white border-0 px-3 py-1 text-xs tracking-wider">
              <Package className="h-3 w-3 mr-1" />
              PACK
            </Badge>
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white hover:bg-gray-100 border-0"
            >
              <Heart className="h-5 w-5 text-gray-900" />
            </Button>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500"></div>
          </div>
        </Link>

        <div className="p-6">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-serif text-xl font-medium mb-2 hover:text-gray-700 transition-colors line-clamp-2 text-black">
              {product.name}
            </h3>
          </Link>

          {product.material && <p className="text-gray-500 text-sm mb-3 font-light">{product.material}</p>}

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-black fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-3 font-light">({product.reviews})</span>
          </div>

          {/* Pack Contents */}
          {product.packContents && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-100 rounded-none">
              <p className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">Pack Includes:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {product.packContents.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-black mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-serif font-medium text-black">{formatPrice(product.price)} DH</span>
              <Badge className="bg-green-100 text-green-800 border-0 text-xs">SAVE 40%</Badge>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-black hover:bg-gray-900 text-white border-0 py-3 text-sm tracking-wider font-medium rounded-none"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "ADD PACK TO CART" : "OUT OF STOCK"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
