import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Bijoux Femme au Maroc — Bracelets, Colliers & Accessoires",
    description:
        "Bijoux et accessoires femme au Maroc : bracelets, colliers, bagues et parures tendance à petit prix. Livraison 24-48h partout au Maroc, paiement à la livraison.",
    keywords: ["bijoux femme maroc", "bijoux maroc", "accessoires femme maroc", "bracelet femme", "collier femme", "bijoux pas cher maroc", "bijoux en ligne maroc", "accessoires maroc"],
    alternates: { canonical: "/products" },
    openGraph: { title: "Bijoux Femme au Maroc — Bracelets, Colliers & Accessoires | Elarain Jewelry", description: "Bijoux et accessoires femme au Maroc : bracelets, colliers, bagues et parures tendance à petit prix. Livraison 24-48h partout au Maroc, paiement à la livraison.", url: "/products" },
}

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
