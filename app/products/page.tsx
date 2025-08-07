import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"

export default function ProductsPage() {
  return (
    <section className="container mx-auto px-6 py-16">
      <header className="mb-16 text-center">
        <h1 className="text-5xl font-serif font-light mb-6 text-black">Our Collection</h1>
        <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
          Discover our carefully curated selection of premium products, each chosen for its exceptional quality and
          timeless appeal.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-80">
          <ProductFilters />
        </aside>

        <main className="flex-1">
          <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
            <p className="text-gray-600 font-light">Showing 1-12 of 156 products</p>
            <select className="border border-gray-200 rounded-none px-6 py-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white text-gray-900 font-light">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
              <option>Newest First</option>
            </select>
          </div>
          <ProductGrid />
        </main>
      </div>
    </section>
  )
}
