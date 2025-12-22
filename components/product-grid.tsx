import { ProductCard } from "./product-card"
import { PackCard } from "./pack-card"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface ProductGridProps {
  products: any[]
  showNavCards?: boolean
}

export function ProductGrid({ products, showNavCards = false }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 cv-auto">
      {showNavCards && (
        <>
          {/* Navigation card: Packs */}
          <div className="col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col card -ml-[15px] w-[calc(100%-8px)]">
            <Card className="group hover:premium-shadow hover:-translate-y-1 transform-gpu transition-all duration-700 border border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.4)] bg-white luxury-card animate-fade-in overflow-hidden rounded-lg flex-grow">
              <CardContent className="p-0">
                <Link href="/packs" className="block relative w-full aspect-video overflow-hidden">
                  <Image
                    src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/PinDown.io_%40777mbalenhle_1758181598%20(1).jpg"
                    alt="Voir les packs"
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ willChange: "transform", transform: "translateZ(0)" }}
                  />
                </Link>
              </CardContent>
            </Card>
            <Link href="/packs" className="mt-2 text-center font-semibold text-gray-800 hover:text-[#D4AF37] transition-colors whitespace-nowrap">
              NOS PACKS →
            </Link>
          </div>

          {/* Navigation card: Collection */}
          <div className="col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col card -ml-[15px] w-[calc(100%-8px)]">
            <Card className="group hover:premium-shadow hover:-translate-y-1 transform-gpu transition-all duration-700 border border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.4)] bg-white luxury-card animate-fade-in overflow-hidden rounded-lg flex-grow">
              <CardContent className="p-0">
                <Link href="/products" className="block relative w-full aspect-video overflow-hidden">
                  <Image
                    src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/PinDown.io_%40jussttagiirl_1758252111%20(1).jpg"
                    alt="Nos collection"
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ willChange: "transform", transform: "translateZ(0)" }}
                  />
                </Link>
              </CardContent>
            </Card>
            <Link href="/products" className="mt-2 text-center font-semibold text-gray-800 hover:text-[#D4AF37] transition-colors whitespace-nowrap">
              NOS COLLECTION →
            </Link>
          </div>

          {/* Navigation card: Watches */}
          <div className="col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col card -ml-[15px] w-[calc(100%-8px)]">
            <Card className="group hover:premium-shadow hover:-translate-y-1 transform-gpu transition-all duration-700 border border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.4)] bg-white luxury-card animate-fade-in overflow-hidden rounded-lg flex-grow">
              <CardContent className="p-0">
                <Link href="/watches" className="block relative w-full aspect-video overflow-hidden">
                  <Image
                    src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/PinDown.io_%40maddyy_r_1757043506%20(1)%20(1).jpg"
                    alt="Nos montres"
                    fill
                    className="object-cover object-[center_70%] transition-transform duration-500 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ willChange: "transform", transform: "translateZ(0)" }}
                  />
                </Link>
              </CardContent>
            </Card>
            <Link href="/watches" className="mt-2 text-center font-semibold text-gray-800 hover:text-[#D4AF37] transition-colors whitespace-nowrap">
              NOS MONTRES →
            </Link>
          </div>
        </>
      )}

      {(products &&
        (showNavCards ? products.filter((product) => product.isPack).sort((a, b) => a.id - b.id) : products))
        .filter((product) => (product.name ?? "").trim() !== "")
        .map((product) =>
          product.isPack ? (
            <PackCard key={product.id} product={product} />
          ) : (
            <ProductCard key={product.id} product={product} />
          )
        )}
    </div>
  )
}
