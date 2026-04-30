import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Special Packs | ELARAIN JEWELRY",
    description: "Discover our curated special packs of luxury jewelry and accessories. Perfect gifts from ELARAIN JEWELRY.",
    keywords: ["jewelry packs", "gift sets", "elarain packs", "luxury gifts"],
}

export default function PacksLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
