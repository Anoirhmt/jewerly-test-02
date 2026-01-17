"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/utils/format-price"
import { type Product } from "@/data/products"

import { motion } from "framer-motion"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // If explicit images are not provided, derive them from variant list
  const mainImage = product.image ?? product.variants?.[0]?.image ?? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNGOEY4RjgiLz48L3N2Zz4="
  const hoverImg = product.hoverImage ?? product.variants?.[1]?.image

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link
        href={`/products/${product.id}`}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-luxury-cream transition-all duration-700 group-hover:shadow-luxury">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 select-none ${hoverImg ? "opacity-100 group-hover:opacity-0" : "opacity-100"}`}
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          {hoverImg && (
            <Image
              src={hoverImg}
              alt={product.name}
              fill
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out group-hover:scale-105 select-none"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          )}

          <div 
            className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-700 z-[1] select-none pointer-events-auto" 
            onContextMenu={(e) => e.preventDefault()}
          />

          {discountPercentage > 0 && (
            <Badge className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/95 backdrop-blur-sm text-black border-0 px-2.5 py-1 md:px-4 md:py-1.5 text-[7px] md:text-[8px] tracking-luxury uppercase font-medium rounded-full z-10 shadow-soft">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        <div className="relative pt-8 pb-4 text-center space-y-3">
          <p className="text-[9px] tracking-luxury-lg uppercase text-gray-400 font-light">
            {product.category}
          </p>
          <h3 className="text-[11px] md:text-xs font-medium text-black uppercase tracking-luxury group-hover:text-gray-600 transition-colors duration-500 px-4 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs font-light text-black tracking-[0.15em]">
            {formatPrice(product.price)}
          </p>
          
          <div className="pt-3">
            <div className="h-[1px] w-0 bg-black/10 mx-auto group-hover:w-12 transition-all duration-700 ease-in-out" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
