import { ProductCard } from "./product-card"
import { PackCard } from "./pack-card"
import { products } from "@/data/products"

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products
        .slice(0, 12)
        .map((product) =>
          product.isPack ? (
            <PackCard key={product.id} product={product} />
          ) : (
            <ProductCard key={product.id} product={product} />
          ),
        )}
    </div>
  )
}
