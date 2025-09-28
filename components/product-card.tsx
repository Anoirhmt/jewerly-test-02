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

  // If explicit images are not provided, derive them from variant list
  const mainImage = product.image ?? product.variants?.[0]?.image ?? "/placeholder.svg"
  const hoverImg = product.hoverImage ?? product.variants?.[1]?.image

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden"
    >
      <div className="relative h-[220px] sm:h-[280px]">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${hoverImg ? "opacity-100 group-hover:opacity-0" : "opacity-100"}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {hoverImg && (
          <Image
            src={hoverImg}
            alt={product.name}
            fill
            className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}

        {discountPercentage > 0 && (
          <Badge className="absolute top-4 left-4 bg-green-100 text-green-800 border-0 px-2 py-0.5 text-[10px] tracking-wider hover:bg-green-100 hover:text-green-800 z-10">
            -{discountPercentage}%
          </Badge>
        )}
      </div>

      <div className="relative bg-white pt-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="rounded-sm">
            {product.category}
          </Badge>
          {product.discount && (
            <Badge variant="destructive" className="rounded-sm">
              -{product.discount}%
            </Badge>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-900">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
