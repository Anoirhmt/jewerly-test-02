'use client';
import Link from "next/link"
import Image from "next/image"
import React from "react"
import { ProductCard } from "@/components/product-card"
import { promoProducts } from "@/data/promo-products"
import { motion } from "framer-motion"

export function FeaturedCategories() {
  const promos = promoProducts.filter(promo => promo.inStock && promo.name)

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[#F9F7F5]">
      <div className="w-full px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mb-10 sm:mb-14 text-center"
        >
          <span className="text-[8px] tracking-[0.5em] uppercase text-[#9b5c5c] mb-3 sm:mb-5 block font-medium">
            Archive Privée
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-black tracking-luxury uppercase">
            Sélections Exclusives
          </h2>
          <div className="w-8 h-[1px] bg-[#9b5c5c]/40 mt-5" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-8">
          {promos.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
