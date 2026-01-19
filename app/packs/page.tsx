"use client"

import { PackCard } from "@/components/pack-card"
import { packsProducts } from "@/data/packs-products"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { motion } from "framer-motion"

const ITEMS_PER_PAGE = 9

export default function PacksPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const packs = packsProducts.filter(pack => pack.inStock && pack.name)
  const totalPages = Math.ceil(packs.length / ITEMS_PER_PAGE)

  // current page from query string, fallback to 1
  let currentPage = Number(searchParams?.page) || 1
  if (currentPage < 1 || currentPage > totalPages) currentPage = 1

  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPacks = packs.slice(start, start + ITEMS_PER_PAGE)

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-luxury-cream pt-32 pb-12 border-b border-black/[0.03] relative z-10">
        <div className="w-full px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[9px] md:text-[10px] tracking-luxury-xl uppercase text-black/30 mb-4 md:mb-6 block font-light">
              Collections Limitées
            </span>
            <h1 className="text-6xl md:text-[110px] font-serif font-medium text-black tracking-luxury-lg uppercase mb-6 md:mb-10 leading-[0.9]">
              Packs <br /> <span className="text-black/10 italic font-light">Exclusifs</span>
            </h1>
            <div className="w-12 h-[1px] bg-black/10 mx-auto mb-6 md:mb-10" />

          </motion.div>
        </div>
      </section>

      <section className="w-full px-6 py-12">
        <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3">
          {paginatedPacks.map((pack) => (
            <PackCard key={pack.id} product={pack} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${currentPage - 1}`}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={`?page=${pageNum}`}
                      isActive={pageNum === currentPage}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  href={`?page=${currentPage + 1}`}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </section>
    </main>
  )
}
