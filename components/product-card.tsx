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
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      className="group block transform-gpu transition-all duration-300 cursor-pointer"
    >
          {/* Image with white background wrapper */}
          <div className="p-2 bg-white">
            <div className="relative h-48 md:h-80 w-full overflow-hidden rounded-lg">
              <Image
                src={product.image || "/placeholder.svg?height=320&width=320&text=Jewelry"}
                alt={product.name}
                fill
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                className="object-cover group-hover:scale-103 transition-transform duration-1000 pointer-events-none rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                style={{ WebkitUserDrag: "none" }}
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-green-100 text-green-800 border-0 px-3 py-1 text-xs tracking-wider">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg leading-tight uppercase tracking-wide line-clamp-2">
              {product.name}
            </h3>
            <p className="text-base text-gray-900">{formatPrice(product.price)}</p>
          </div>

    </Link>
  )
}
