"use client"

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group block"
    >
      <Link href={`/products/${product.id}`} draggable={false} className="block">

        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F2EDE6]">
          <Image
            src={validSrc}
            alt={product.name}
            fill
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] select-none"
            sizes="(max-width: 640px) 50vw, 25vw"
          />

          {/* Dark overlay on hover/always mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent
            md:from-black/0 md:via-transparent md:to-transparent
            md:group-hover:from-black/55 md:group-hover:via-black/15
            transition-all duration-700" />

          {/* Pack badge — top left */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <span className="bg-[#c5a367] text-white text-[6px] tracking-[0.35em] uppercase font-medium px-2.5 py-1">
              Pack
            </span>
            {product.isBestSeller && (
              <span className="bg-black/70 backdrop-blur-sm text-[#c5a367] text-[6px] tracking-[0.3em] uppercase font-medium px-2.5 py-1">
                Best Seller
              </span>
            )}
          </div>

          {/* Discount badge — top right */}
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-black/60 backdrop-blur-sm text-white text-[7px] tracking-[0.2em] font-medium px-2 py-1">
              −20%
            </span>
          </div>

          {/* CTA — bottom, always on mobile */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-4
            md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0
            transition-all duration-500">
            <span className="bg-white text-black text-[7px] tracking-[0.4em] uppercase font-medium px-6 py-2">
              Voir →
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="pt-3.5 pb-2 px-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[7px] tracking-[0.45em] uppercase text-[#c5a367] font-medium mb-1">
                Elarain
              </p>
              <h3 className="text-[10px] sm:text-[11px] font-medium text-black uppercase tracking-[0.12em] leading-snug line-clamp-2">
                {product.name}
              </h3>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[12px] sm:text-[13px] font-semibold text-black tracking-[0.05em]">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          {/* Gold underline on hover */}
          <div className="mt-3 h-[1px] w-0 bg-[#c5a367]/50 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
        </div>
      </Link>
    </motion.div>
  )
}
