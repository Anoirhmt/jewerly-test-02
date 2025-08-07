"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/utils/format-price"
import type { Product } from "@/data/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isLoading } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast({
      title: "Added to collection",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card className="group hover:premium-shadow transition-all duration-700 border-0 bg-white luxury-card animate-fade-in overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="relative overflow-hidden h-80 bg-gradient-to-br from-gray-50 to-gray-100">
            <Image
              src={product.image || "/placeholder.svg?height=320&width=320&text=Jewelry"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000 filter grayscale group-hover:grayscale-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            {discountPercentage > 0 && (
              <Badge className="absolute top-4 left-4 bg-black text-white border-0 px-3 py-1 text-xs tracking-wider">
                -{discountPercentage}%
              </Badge>
            )}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white hover:bg-gray-100 border-0"
            >
              <Heart className="h-5 w-5 text-gray-900" />
            </Button>
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

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-serif font-medium text-black">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through font-light">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full premium-button text-white border-0 py-4 text-sm tracking-[0.2em] font-medium rounded-none uppercase"
            disabled={!product.inStock || isLoading}
          >
            <ShoppingCart className="h-4 w-4 mr-3" />
            {product.inStock ? "Add to Collection" : "Out of Stock"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
