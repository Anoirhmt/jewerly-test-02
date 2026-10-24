import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Montres Femme au Maroc — Prix & Livraison Rapide",
    description:
        "Montres femme élégantes au Maroc : montres dorées, argentées et avec strass à petit prix. Livraison 24-48h à Rabat, Casablanca, Marrakech et partout au Maroc. Paiement à la livraison.",
    keywords: ["montres femme maroc", "montre femme", "montre femme pas cher", "montre dorée femme", "montres maroc", "montre femme casablanca", "montre femme rabat", "acheter montre en ligne maroc"],
    alternates: { canonical: "/watches" },
    openGraph: { title: "Montres Femme au Maroc — Prix & Livraison Rapide | Elarain Jewelry", description: "Montres femme élégantes au Maroc : montres dorées, argentées et avec strass à petit prix. Livraison 24-48h à Rabat, Casablanca, Marrakech et partout au Maroc. Paiement à la livraison.", url: "/watches" },
}

export default function WatchesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
