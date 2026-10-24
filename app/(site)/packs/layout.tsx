import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Packs Cadeau Femme — Montre + Bijoux au Maroc",
    description:
        "Packs cadeau femme au Maroc : montre, bracelet, collier et accessoires réunis dans un coffret à petit prix. Idéal pour un anniversaire. Livraison 24-48h, paiement à la livraison.",
    keywords: ["pack cadeau femme", "coffret cadeau femme maroc", "cadeau femme maroc", "idée cadeau femme", "pack montre bijoux", "cadeau anniversaire femme maroc"],
    alternates: { canonical: "/packs" },
    openGraph: { title: "Packs Cadeau Femme — Montre + Bijoux au Maroc | Elarain Jewelry", description: "Packs cadeau femme au Maroc : montre, bracelet, collier et accessoires réunis dans un coffret à petit prix. Idéal pour un anniversaire. Livraison 24-48h, paiement à la livraison.", url: "/packs" },
}

export default function PacksLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
