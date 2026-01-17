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
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
      {showNavCards && (
        <>
          {/* Navigation card: Packs */}
          <div className="col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col group">
            <Link href="/packs" className="relative aspect-video overflow-hidden bg-gray-50 mb-4 block">
              <Image
                src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/PinDown.io_%40777mbalenhle_1758181598%20(1).jpg"
                alt="Voir les packs"
                fill
                className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium border-b border-white/50 pb-1">
                  Packs Exclusifs
                </span>
              </div>
            </Link>
            <Link href="/packs" className="text-center font-medium text-[10px] tracking-[0.3em] uppercase text-black hover:text-gray-600 transition-colors">
              Découvrir →
            </Link>
          </div>

          {/* Navigation card: Collection */}
          <div className="col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col group">
            <Link href="/products" className="relative aspect-video overflow-hidden bg-gray-50 mb-4 block">
              <Image
                src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/PinDown.io_%40jussttagiirl_1758252111%20(1).jpg"
                alt="Nos collection"
                fill
                className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium border-b border-white/50 pb-1">
                  Notre Collection
                </span>
              </div>
            </Link>
            <Link href="/products" className="text-center font-medium text-[10px] tracking-[0.3em] uppercase text-black hover:text-gray-600 transition-colors">
              Explorer →
            </Link>
          </div>

          {/* Navigation card: Watches */}
          <div className="col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col group">
            <Link href="/watches" className="relative aspect-video overflow-hidden bg-gray-50 mb-4 block">
              <Image
                src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/PinDown.io_%40maddyy_r_1757043506%20(1)%20(1).jpg"
                alt="Nos montres"
                fill
                className="object-cover object-[center_70%] transition-transform duration-1000 ease-in-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium border-b border-white/50 pb-1">
                  Nos Montres
                </span>
              </div>
            </Link>
            <Link href="/watches" className="text-center font-medium text-[10px] tracking-[0.3em] uppercase text-black hover:text-gray-600 transition-colors">
              Voir tout →
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
