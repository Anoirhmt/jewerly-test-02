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
      : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNGOEY4RjgiLz48L3N2Zz4="

  return (
    <div className="group block transform-gpu transition-all duration-500">
      <Link
        href={`/products/${product.id}`}
        draggable={false}
        className="cursor-pointer block group"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 mb-6">
          <Image
            src={validSrc}
            alt={product.name}
            fill
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="object-cover group-hover:scale-110 transition-transform duration-500 select-none"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1.5 md:gap-2">
            <Badge className="bg-white/95 backdrop-blur-sm text-black border-0 rounded-full px-2 py-0.5 md:px-3 md:py-1 text-[7px] md:text-[8px] tracking-[0.2em] uppercase font-medium shadow-sm">
              Pack Exclusif
            </Badge>
            <Badge className="bg-white/95 backdrop-blur-sm text-black border-0 rounded-full px-2 py-0.5 md:px-3 md:py-1 text-[7px] md:text-[8px] tracking-[0.2em] uppercase font-medium shadow-sm w-fit">
              -20%
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div className="text-center space-y-3 px-2">
          <h3 className="text-[11px] md:text-xs font-medium text-black tracking-[0.2em] uppercase line-clamp-1">
            {product.name}
          </h3>
          {product.material && (
            <p className="text-[10px] text-gray-400 font-light tracking-widest uppercase">{product.material}</p>
          )}
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs font-light text-gray-400 line-through tracking-wider">
              {formatPrice(product.price * 1.25)}
            </span>
            <span className="text-xs font-medium text-black tracking-[0.2em]">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
