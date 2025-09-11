import { ProductCard } from "./product-card"

interface RelatedProductsProps {
  currentProductId: string | number
  products: any[]
}

export function RelatedProducts({ currentProductId, products }: RelatedProductsProps) {
  const currentProduct = products.find((p) => p.id.toString() === currentProductId.toString())

  // Prefer same-category items, fill remaining slots with any other products from the list
  let relatedProducts = products.filter(
    (product) => product.id.toString() !== currentProductId.toString() &&
      (currentProduct ? product.category === currentProduct.category : false)
  )

  if (relatedProducts.length < 4) {
    const additional = products.filter(
      (p) => p.id.toString() !== currentProductId.toString() && !relatedProducts.includes(p)
    )
    relatedProducts = [...relatedProducts, ...additional].slice(0, 4)
  } else {
    relatedProducts = relatedProducts.slice(0, 4)
  }

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
