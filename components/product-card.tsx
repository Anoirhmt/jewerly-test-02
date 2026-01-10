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
  const mainImage = product.image ?? product.variants?.[0]?.image ?? "/placeholder.svg"
  const hoverImg = product.hoverImage ?? product.variants?.[1]?.image

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Link
        href={`/products/${product.id}`}
        className="group block overflow-hidden"
      >
        <div className="relative h-[220px] sm:h-[350px] overflow-hidden bg-[#f9f9f9]">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 ${hoverImg ? "opacity-100 group-hover:opacity-0" : "opacity-100"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {hoverImg && (
            <Image
              src={hoverImg}
              alt={product.name}
              fill
              className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

          {discountPercentage > 0 && (
            <Badge className="absolute top-4 left-4 bg-white text-black border-0 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium rounded-none z-10 shadow-sm">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        <div className="relative bg-white pt-5 pb-2 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-2 font-serif">
            {product.category}
          </p>
          <h3 className="text-sm font-medium text-black uppercase tracking-[0.1em] mb-1 group-hover:text-gray-600 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm font-light text-black tracking-widest">
            {formatPrice(product.price)}
          </p>
          
          <div className="mt-4 h-[1px] w-0 bg-black mx-auto group-hover:w-12 transition-all duration-500" />
        </div>
      </Link>
    </motion.div>
  )
}
