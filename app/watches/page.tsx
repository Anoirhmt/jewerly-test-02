"use client"

import { ProductGrid } from "@/components/product-grid";
import { managementProducts } from "@/data/management-products";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { motion } from "framer-motion"

const ITEMS_PER_PAGE = 9;

export default async function WatchesPage({
  searchParams,
}: {
  searchParams?: { search?: string; page?: string };
}) {
  // Use locally managed products list; filter for those tagged as watches
  const watches = managementProducts.filter((p: any) =>
    p.category?.toLowerCase().includes("watch")
  );

  const query = searchParams?.search?.toLowerCase() || "";
  const filtered = query
    ? watches.filter((p: any) => p.name.toLowerCase().includes(query))
    : watches;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  let currentPage = Number(searchParams?.page) || 1;
  if (currentPage < 1 || currentPage > totalPages) currentPage = 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

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
              Maîtrise du Temps
            </span>
            <h1 className="text-6xl md:text-[110px] font-serif font-medium text-black tracking-luxury-lg uppercase mb-6 md:mb-10 leading-[0.9]">
              Nos <br /> <span className="text-black/10 italic font-light">Montres</span>
            </h1>
            <div className="w-12 h-[1px] bg-black/10 mx-auto mb-6 md:mb-10" />
            <p className="text-black/40 font-light tracking-luxury-xl uppercase text-[9px] md:text-[11px] leading-relaxed-extra max-w-2xl mx-auto px-4">
              L'alliance parfaite de la précision technique et du design intemporel. Des garde-temps d'exception pour ceux qui exigent l'excellence.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="w-full px-6 py-12">
        <ProductGrid products={paginated} />

        {totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?${query ? `search=${encodeURIComponent(query)}&` : ""}page=${currentPage - 1}`}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={`?${query ? `search=${encodeURIComponent(query)}&` : ""}page=${pageNum}`}
                      isActive={pageNum === currentPage}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href={`?${query ? `search=${encodeURIComponent(query)}&` : ""}page=${currentPage + 1}`}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </section>
    </main>
  );
}
