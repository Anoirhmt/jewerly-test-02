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

const ITEMS_PER_PAGE = 9

export default async function PacksPage({
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
    <main className="container mx-auto px-6 py-16">
      <header className="mb-16 text-center">
        <h1 className="mb-6 text-5xl font-serif font-semibold uppercase tracking-wide text-black">
          Jewelry Packs
        </h1>
      </header>

      <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedPacks.map((pack) => (
          <PackCard key={pack.id} product={pack} />
        ))}
      </section>

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
    </main>
  )
}
