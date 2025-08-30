import { ProductDetails } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-products"
import { products } from "@/data/products"
import { notFound } from "next/navigation"
import { getProductsFromFirestore, getPacksFromFirestore, getPromoFromFirestore } from "@/lib/firestore-products"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const idParam = params.id

  // Try local static list first (fast)
  let product: any | undefined = products.find((p) => p.id.toString() === idParam)
  let relatedProductsSource: any[] = products

  // If not found locally, fetch the single document from each collection in parallel (lighter than full collection scans)
  if (!product) {
    const [collectionSnap, promoSnap, packSnap] = await Promise.all([
      getDoc(doc(db!, "collection", idParam)),
      getDoc(doc(db!, "promo", idParam)),
      getDoc(doc(db!, "packs", idParam)),
    ])

    if (collectionSnap.exists()) {
      const data = collectionSnap.data() as any
      product = { id: collectionSnap.id, inStock: data.inStock ?? true, ...data }
      relatedProductsSource = await getProductsFromFirestore()
    } else if (promoSnap.exists()) {
      const data = promoSnap.data() as any
      product = { id: promoSnap.id, inStock: data.inStock ?? true, ...data }
      relatedProductsSource = await getPromoFromFirestore()
    } else if (packSnap.exists()) {
      const data = packSnap.data() as any
      product = { id: packSnap.id, inStock: data.inStock ?? true, ...data }
      relatedProductsSource = await getPacksFromFirestore()
    }
  }

  // If still not found after all lookups, return 404 below


  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
      <RelatedProducts currentProductId={product.id} products={relatedProductsSource} />
    </div>
  )
}
