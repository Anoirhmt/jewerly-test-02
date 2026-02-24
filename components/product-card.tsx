"use client"

import type React from "react"
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

  const mainImage = product.image ?? product.variants?.[0]?.image ?? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNGOUY3RjUiLz48L3N2Zz4="
  const hoverImg = product.hoverImage ?? product.variants?.[1]?.image

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/products/${product.id}`} className="block active:opacity-80 transition-opacity">
        {/* ── Image wrapper ── */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F7F5]">

          {/* Main image */}
          <Image
            src={mainImage}
            alt={product.name}
            fill
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] select-none ${hoverImg ? "opacity-100 group-hover:opacity-0" : "opacity-100"
              }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Swap image (desktop hover only) */}
          {hoverImg && (
            <Image
              src={hoverImg}
              alt={`${product.name} – vue alternative`}
              fill
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] select-none"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Bottom gradient — always on mobile so content is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-[1]" />

          {/* Discount badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
              <span className="bg-[#9b5c5c] text-white text-[7px] tracking-[0.2em] uppercase font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* "Voir" pill — visible on mobile always, hover-only on desktop */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10
            md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0
            md:transition-all md:duration-400">
            <span className="bg-white/90 backdrop-blur-sm text-black text-[7px] sm:text-[8px] tracking-[0.3em] uppercase font-medium px-4 py-1.5 rounded-full shadow-soft border border-white/60">
              Voir →
            </span>
          </div>
        </div>

        {/* ── Info block ── */}
        <div className="pt-3 sm:pt-4 pb-2 text-center px-1">
          {/* Category */}
          <p className="text-[7px] sm:text-[8px] tracking-[0.38em] uppercase text-[#9b5c5c]/70 font-light mb-1 sm:mb-2 truncate">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="text-[10px] sm:text-[11px] md:text-[12px] font-medium text-black uppercase tracking-[0.12em] sm:tracking-luxury leading-snug line-clamp-2 px-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
            <p className="text-[11px] sm:text-[13px] font-medium text-black tracking-[0.1em]">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-[9px] sm:text-[10px] font-light text-black/30 line-through tracking-[0.08em]">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>

          {/* Accent underline — desktop only */}
          <div className="hidden md:flex justify-center mt-3">
            <div className="h-[1px] w-0 bg-[#9b5c5c]/30 group-hover:w-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
