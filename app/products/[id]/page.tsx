import { ProductDetails } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-products"
import { products } from "@/data/products"
import { managementProducts } from "@/data/watche-products"
import { collectionProducts } from "@/data/collection-products"
import { promoProducts } from "@/data/promo-products"
import { packsProducts } from "@/data/packs-products"
import { notFound } from "next/navigation"
import { SpecialPackForm } from "@/components/special-pack-form"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const idParam = params.id

  const mergedProducts = [
    ...managementProducts,
    ...packsProducts,
    ...promoProducts,
    ...collectionProducts,
    ...products,
  ].filter(p => p.name)

  let product: any | undefined = mergedProducts.find((p) => p.id.toString() === idParam)
  let relatedProductsSource: any[] = mergedProducts

  if (product) {
    if (promoProducts.some((p) => p.id.toString() === product.id.toString())) {
      relatedProductsSource = promoProducts.filter((p) => p.name)
    } else if (packsProducts.some((p) => p.id.toString() === product.id.toString())) {
      relatedProductsSource = packsProducts.filter((p) => p.name)
    } else if (collectionProducts.some((p) => p.id.toString() === product.id.toString())) {
      relatedProductsSource = collectionProducts.filter((p) => p.name)
    } else if (managementProducts.some((p) => p.id.toString() === product.id.toString())) {
      relatedProductsSource = managementProducts.filter((p) => p.name)
    }
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="bg-white min-h-screen pt-16 md:pt-20">
      <div className="w-full px-6">
        <ProductDetails product={product} />
        {product.id === 211 ? (
          <SpecialPackForm product={product} />
        ) : (
          <RelatedProducts currentProductId={product.id} products={relatedProductsSource} />
        )}
      </div>
    </div>
  )
}
