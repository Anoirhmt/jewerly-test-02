"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Package } from "lucide-react"
import { formatPrice } from "@/utils/format-price"
import type { Product } from "@/data/products"

interface PackCardProps {
  product: Product
}

export function PackCard({ product }: PackCardProps) {
  const validSrc =
    product.image &&
    (product.image.startsWith("http://") ||
      product.image.startsWith("https://") ||
      product.image.startsWith("/"))
      ? product.image
      : "/placeholder.svg?height=320&width=320&text=Jewelry"

  return (
    <Link
      href={`/products/${product.id}`}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      className="group block transform-gpu transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="p-2 bg-white">
        <div className="relative h-48 md:h-80 w-full overflow-hidden rounded-lg">
          <Image
            src={validSrc}
            alt={product.name}
            fill
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="object-cover group-hover:scale-103 transition-transform duration-1000 pointer-events-none rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            style={{ WebkitUserDrag: "none" }}
          />
          <Badge className="absolute top-4 left-4 bg-black text-white border-0 px-3 py-1 text-xs tracking-wider flex items-center gap-1">
            <Package className="h-3 w-3" />
            PACK
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg leading-tight uppercase tracking-wide line-clamp-2 text-black">
          {product.name}
        </h3>
        {product.material && (
          <p className="text-gray-500 text-sm font-light">{product.material}</p>
        )}

        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-black">{formatPrice(product.price)}</span>
          <Badge className="bg-green-100 text-green-800 border-0 text-xs">SAVE 20%</Badge>
        </div>
      </div>
    </Link>
  )
}
