import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Luxury Watches | ELARAIN JEWELRY",
    description: "Explore our collection of premium luxury watches. Timing and elegance redefined by ELARAIN JEWELRY.",
    keywords: ["luxury watches", "designer watches", "elarain watches", "mens watches", "womens watches"],
}

export default function WatchesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
