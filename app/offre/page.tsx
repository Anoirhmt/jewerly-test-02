import type { Metadata } from "next"
import { Tajawal } from "next/font/google"
import { packsProducts } from "@/data/packs-products"
import { OffrePage } from "@/components/offre/offre-page"
import { FbPixelScript } from "@/components/offre/fb-pixel-script"

// Hidden page for Facebook ads (not in the menu, not on Google): elarain.store/offre,
// or elarain.store/offre?pack=211 to show one pack first.

const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["400", "500", "700", "800"], display: "swap" })

export const metadata: Metadata = {
  title: "Offres spéciales — Elarain Jewelry",
  description: "Packs bijoux Elarain : livraison gratuite partout au Maroc, paiement à la livraison.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function Page({ searchParams }: { searchParams: { pack?: string } }) {
  const packs = packsProducts.filter((p) => p.inStock && p.name)
  const featured = Number(searchParams.pack)
  return (
    <>
      <FbPixelScript />
      <OffrePage
        packs={packs}
        featuredId={packs.some((p) => p.id === featured) ? featured : null}
        arabicFont={tajawal.className}
      />
    </>
  )
}
