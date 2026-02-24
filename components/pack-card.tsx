"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/utils/format-price"
import type { Product } from "@/data/products"
import { motion } from "framer-motion"

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
      : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNGOUY3RjUiLz48L3N2Zz4="

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group block"
    >
      <Link href={`/products/${product.id}`} draggable={false} className="block active:opacity-80 transition-opacity">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F7F5]">
          <Image
            src={validSrc}
            alt={product.name}
            fill
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] select-none"
            sizes="(max-width: 640px) 50vw, 25vw"
          />

          {/* Gradient — always on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
            <span className="bg-[#9b5c5c] text-white text-[7px] tracking-[0.2em] uppercase font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm">
              Pack
            </span>
            <span className="bg-white/90 backdrop-blur-sm text-black text-[7px] tracking-[0.2em] uppercase font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm w-fit">
              −20%
            </span>
          </div>

          {/* Hover pill — visible on mobile always */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10
            md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0
            md:transition-all md:duration-400">
            <span className="bg-white/90 backdrop-blur-sm text-black text-[7px] sm:text-[8px] tracking-[0.3em] uppercase font-medium px-4 py-1.5 rounded-full shadow-soft border border-white/60">
              Voir →
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="text-center pt-3 sm:pt-4 pb-2 px-1">
          <h3 className="text-[10px] sm:text-[11px] md:text-[12px] font-medium text-black tracking-[0.12em] sm:tracking-luxury uppercase leading-snug line-clamp-2">
            {product.name}
          </h3>
          {product.material && (
            <p className="text-[7px] sm:text-[8px] tracking-[0.3em] text-[#9b5c5c]/60 font-light uppercase mt-1 truncate">
              {product.material}
            </p>
          )}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
            <span className="text-[9px] sm:text-[10px] font-light text-black/30 line-through tracking-wider">
              {formatPrice(product.price * 1.25)}
            </span>
            <span className="text-[11px] sm:text-[13px] font-medium text-black tracking-[0.1em]">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
