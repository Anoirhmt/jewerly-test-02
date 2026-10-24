import { ProductDetails } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-products"
import { products } from "@/data/products"
import { managementProducts } from "@/data/watche-products"
import { collectionProducts } from "@/data/collection-products"
import { getPacks } from "@/lib/packs"
import { notFound } from "next/navigation"
import { SpecialPackForm } from "@/components/special-pack-form"
import type { Metadata } from "next"

const SITE_URL = "https://www.elarain.store"

async function allProducts() {
  const packsProducts = await getPacks()
  return { packsProducts, merged: [...managementProducts, ...packsProducts, ...collectionProducts, ...products].filter(p => p.name) }
}

function absolute(url?: string) {
  if (!url) return undefined
  return url.startsWith("http") ? url : `${SITE_URL}${url}`
}

// Category word Google should see next to the product name
function kind(p: any): string {
  if (p.isPack || p.category === "pack") return "Pack cadeau femme"
  if (p.category === "watch") return "Montre femme"
  if (p.category === "bracelet") return "Bracelet femme"
  if (p.category === "collier") return "Collier femme"
  return "Bijou femme"
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { merged } = await allProducts()
  const p: any = merged.find((x) => x.id.toString() === params.id)
  if (!p) return {}
  const title = { absolute: `${p.name} — ${kind(p)} ${p.price} DH | Elarain Jewelry` }
  const description = `${kind(p)} ${p.name} à ${p.price} DH chez Elarain Jewelry. Livraison 24-48h partout au Maroc (Rabat, Casablanca, Marrakech...), paiement à la livraison.`
  const image = absolute(p.image ?? p.variants?.[0]?.image)
  return {
    title,
    description,
    alternates: { canonical: `/products/${p.id}` },
    openGraph: { title: title.absolute, description, url: `/products/${p.id}`, images: image ? [{ url: image }] : undefined },
  }
}

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const idParam = params.id
  const { packsProducts, merged: mergedProducts } = await allProducts()

  let product: any | undefined = mergedProducts.find((p) => p.id.toString() === idParam)
  let relatedProductsSource: any[] = mergedProducts

  if (product) {
    if (packsProducts.some((p) => p.id.toString() === product.id.toString())) {
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

  const image = absolute(product.image ?? product.variants?.[0]?.image)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description && product.description.length > 12 ? product.description : `${kind(product)} ${product.name}`,
    image: image ? [image] : undefined,
    category: kind(product),
    sku: String(product.id),
    brand: { "@type": "Brand", name: "Elarain Jewelry" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: "MAD",
      price: product.price,
      availability: product.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Elarain Jewelry" },
    },
  }

  return (
    <div className="bg-white min-h-screen pt-16 md:pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
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
