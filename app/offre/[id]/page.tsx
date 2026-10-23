import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Tajawal } from "next/font/google"
import { packsProducts } from "@/data/packs-products"
import { PackLanding } from "@/components/offre/pack-landing"
import { FbPixelScript } from "@/components/offre/fb-pixel-script"
import { packTitles } from "@/components/offre/shared"

// One hidden landing page per pack for Facebook ads: elarain.store/offre/211 (not in the menu, not on Google).

const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["400", "500", "700", "800"], display: "swap" })

const livePacks = () => packsProducts.filter((p) => p.inStock && p.name)
const findPack = (id: string) => livePacks().find((p) => String(p.id) === id)

export const dynamicParams = false

export function generateStaticParams() {
  return livePacks().map((p) => ({ id: String(p.id) }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = findPack(params.id)
  if (!p) return {}
  const t = packTitles(p)
  const title = `${t.fr} — ${p.price} DH · Elarain Jewelry`
  // "absolute" so the site layout doesn't append "| Elarain Jewelry" a second time.
  const description = `${t.ar} · Livraison gratuite partout au Maroc, paiement à la livraison.`
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: null },
    openGraph: { title, description, images: p.image ? [{ url: p.image }] : [] },
  }
}

export default function Page({ params }: { params: { id: string } }) {
  const pack = findPack(params.id)
  if (!pack) notFound()
  const others = livePacks().filter((p) => p.id !== pack.id)
  return (
    <>
      <FbPixelScript />
      <PackLanding pack={pack} others={others} arabicFont={tajawal.className} />
    </>
  )
}
