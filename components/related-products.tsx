import { ProductCard } from "./product-card"

interface RelatedProductsProps {
  currentProductId: string | number
  products: any[]
}

export function RelatedProducts({ currentProductId, products }: RelatedProductsProps) {
  const relatedProducts = products
    .filter((product) => product.id.toString() !== currentProductId.toString())
    .slice(0, 4)

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
