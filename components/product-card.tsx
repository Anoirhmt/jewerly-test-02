"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/utils/format-price"
import type { Product } from "@/data/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card className="group hover:premium-shadow hover:-translate-y-1 transform-gpu transition-all duration-700 border border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.4)] bg-white luxury-card animate-fade-in overflow-hidden rounded-lg">
      <CardContent className="p-0">
        <Link href={`/products/${product.id}`} draggable={false} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} onCopy={(e) => e.preventDefault()} className="block">
          <div className="relative h-80 w-full">
            <Image
              src={product.image || "/placeholder.svg?height=320&width=320&text=Jewelry"}
              alt={product.name}
              fill
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              className="object-cover group-hover:scale-103 transition-transform duration-1000 pointer-events-none"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              style={{ WebkitUserDrag: "none" }}
            />
            {discountPercentage > 0 && (
              <Badge className="absolute top-4 left-4 bg-black text-white border-0 px-3 py-1 text-xs tracking-wider">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
        </Link>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg leading-tight uppercase tracking-wide line-clamp-2">
            {product.name}
          </h3>
          <p className="text-base text-gray-900">{formatPrice(product.price)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
