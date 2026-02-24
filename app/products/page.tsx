"use client"

import { ProductGrid } from "@/components/product-grid"
import { collectionProducts } from "@/data/collection-products"
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

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { search?: string; page?: string }
}) {
  const products = collectionProducts.filter((p: any) => p.inStock && p.name && p.name.trim() !== "")
  const query = searchParams?.search?.toLowerCase() || ""
  const filtered = query ? products.filter((p: any) => p.name.toLowerCase().includes(query)) : products

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  let currentPage = Number(searchParams?.page) || 1
  if (currentPage < 1 || currentPage > totalPages) currentPage = 1
  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE)

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#F9F7F5] pt-28 pb-14 border-b border-black/[0.04] relative z-10">
        <div className="w-full px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[8px] tracking-[0.55em] uppercase text-[#9b5c5c] mb-5 block font-medium">
              L&apos;Art du Détail
            </span>
            <h1 className="text-5xl md:text-[100px] font-serif font-medium text-black tracking-luxury-lg uppercase mb-8 md:mb-10 leading-[0.9]">
              Notre <br /> <span className="text-black/10 italic font-light">Collection</span>
            </h1>
            <div className="w-10 h-[1px] bg-[#9b5c5c]/40 mx-auto mb-6" />
            {query && (
              <p className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-light mt-3">
                Résultats pour : <span className="text-[#9b5c5c]">&ldquo;{query}&rdquo;</span>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="w-full px-6 py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[11px] tracking-[0.4em] uppercase text-black/25 font-light">
              Aucun résultat trouvé
            </p>
          </div>
        ) : (
          <ProductGrid products={paginated} />
        )}

        {totalPages > 1 && (
          <Pagination className="mt-16">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?${query ? `search=${encodeURIComponent(query)}&` : ""}page=${currentPage - 1}`}
                  className={currentPage === 1 ? "pointer-events-none opacity-30" : "hover:text-[#9b5c5c] transition-colors duration-300"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={`?${query ? `search=${encodeURIComponent(query)}&` : ""}page=${pageNum}`}
                      isActive={pageNum === currentPage}
                      className={pageNum === currentPage ? "border-[#9b5c5c] text-[#9b5c5c]" : ""}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  href={`?${query ? `search=${encodeURIComponent(query)}&` : ""}page=${currentPage + 1}`}
                  className={currentPage === totalPages ? "pointer-events-none opacity-30" : "hover:text-[#9b5c5c] transition-colors duration-300"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </section>
    </main>
  )
}
