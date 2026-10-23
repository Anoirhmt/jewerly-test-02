import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Tajawal } from "next/font/google"
import { getPacks } from "@/lib/packs"
import { PackLanding } from "@/components/offre/pack-landing"
import { FbPixelScript } from "@/components/offre/fb-pixel-script"
import { packTitles } from "@/components/offre/shared"

// One hidden landing page per pack for Facebook ads: elarain.store/offre/211 (not in the menu, not on Google).

const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["400", "500", "700", "800"], display: "swap" })

const livePacks = async () => (await getPacks()).filter((p) => p.inStock && p.name)
const findPack = async (id: string) => (await livePacks()).find((p) => String(p.id) === id)

// Packs added in the dashboard get their page on first visit; prices refresh within 5 minutes
// (immediately after saving in the dashboard).
export const revalidate = 300

export async function generateStaticParams() {
  return (await livePacks()).map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await findPack(params.id)
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

export default async function Page({ params }: { params: { id: string } }) {
  const pack = await findPack(params.id)
  if (!pack) notFound()
  const others = (await livePacks()).filter((p) => p.id !== pack.id)
  return (
    <>
      <FbPixelScript />
      <PackLanding pack={pack} others={others} arabicFont={tajawal.className} />
    </>
  )
}
