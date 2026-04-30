import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Collection | ELARAIN JEWELRY",
    description: "Browse our exclusive collection of high-end jewelry. From necklaces to rings, find the perfect piece at ELARAIN JEWELRY.",
    keywords: ["jewelry collection", "luxury necklaces", "designer rings", "elarain collection"],
}

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
