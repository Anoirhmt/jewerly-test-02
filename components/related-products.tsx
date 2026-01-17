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
    <section className="mt-32 pt-16 border-t border-gray-100">
      <div className="flex flex-col items-center mb-16 text-center">
        <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-4 block">Découvrez aussi</span>
        <h2 className="text-3xl font-serif font-medium text-black tracking-luxury uppercase italic">Vous Aimerez Aussi</h2>
        <div className="w-12 h-[1px] bg-black mt-8" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
