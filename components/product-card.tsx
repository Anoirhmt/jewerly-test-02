"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/utils/format-price"
import { type Product } from "@/data/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden"
    >
      <div className="relative h-[220px] sm:h-[280px]">
        <Image
          src={product.image || "/placeholder.svg?height=450&width=350&text=Jewelry"}
          alt={product.name}
          fill
          className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        <Image
          src={product.hoverImage || product.image || "/placeholder.svg?height=450&width=350&text=Jewelry"}
          alt={product.name}
          fill
          className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {discountPercentage > 0 && (
          <Badge className="absolute top-4 left-4 bg-green-100 text-green-800 border-0 px-2 py-0.5 text-[10px] tracking-wider hover:bg-green-100 hover:text-green-800 z-10">
            -{discountPercentage}%
          </Badge>
        )}
      </div>
      
      <div className="relative bg-white pt-3">
        <h3 className="text-sm text-gray-700">
          {product.name}
        </h3>
        
        <p className="mt-1.5 tracking-wide text-gray-900">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
