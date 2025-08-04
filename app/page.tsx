import { ProductGrid } from "@/components/product-grid"
import { Hero } from "@/components/hero"
import { FeaturedCategories } from "@/components/featured-categories"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedCategories />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <ProductGrid />
        </div>
      </section>
    </div>
  )
}
