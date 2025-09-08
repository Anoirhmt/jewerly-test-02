import { ProductCard } from "./product-card"
import { PackCard } from "./pack-card"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"


interface ProductGridProps {
  products: any[];
  showNavCards?: boolean;
}

export function ProductGrid({ products, showNavCards = false }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {showNavCards && (
        <>
          {/* Navigation card: Packs */}
            <div className="col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col">
  <Card className="group hover:premium-shadow hover:-translate-y-1 transform-gpu transition-all duration-700 border border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.4)] bg-white luxury-card animate-fade-in overflow-hidden rounded-lg flex-grow">
    <CardContent className="p-0">
      <Link href="/packs" className="block relative w-full aspect-video overflow-hidden">
        <Image
          src="https://drive.google.com/uc?id=1k5HPHHU-wj1aqn9aF9UH9ZPJzU5rt-xJ"
          alt="Voir les packs"
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
      </Link>
    </CardContent>
  </Card>
  <Link href="/packs" className="mt-2 text-center font-semibold text-gray-800 hover:text-[#D4AF37] transition-colors">NOS PACKS →</Link>
</div>
          
          {/* Navigation card: Collection */}
            <div className="col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col">
  <Card className="group hover:premium-shadow hover:-translate-y-1 transform-gpu transition-all duration-700 border border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.4)] bg-white luxury-card animate-fade-in overflow-hidden rounded-lg flex-grow">
    <CardContent className="p-0">
      <Link href="/products" className="block relative w-full aspect-video overflow-hidden">
        <Image
          src="https://drive.google.com/uc?id=1_Q2J7loYoicK5N57DfyhYOwWDiObYL3q"
           alt="Nos collection"
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
      </Link>
    </CardContent>
  </Card>
  <Link href="/products" className="mt-2 text-center font-semibold text-gray-800 hover:text-[#D4AF37] transition-colors">NOS COLLECTION →</Link>
</div>

          {/* Navigation card: Watches */}
            <div className="col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col">
  <Card className="group hover:premium-shadow hover:-translate-y-1 transform-gpu transition-all duration-700 border border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.4)] bg-white luxury-card animate-fade-in overflow-hidden rounded-lg flex-grow">
    <CardContent className="p-0">
      <Link href="/watches" className="block relative w-full aspect-video overflow-hidden">
        <Image
          src="https://drive.google.com/uc?id=1wU-K1EzW_CBIhs1AN6cqi3d3ybMVgxu9"
          alt="Nos montres"
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
      </Link>
    </CardContent>
  </Card>
  <Link href="/watches" className="mt-2 text-center font-semibold text-gray-800 hover:text-[#D4AF37] transition-colors">NOS MONTRES →</Link>
</div>
        </>
      )}

      {products && (showNavCards ? products.filter(product => product.isPack).sort((a, b) => a.id - b.id) : products)
        .map((product) =>
          product.isPack ? (
            <PackCard key={product.id} product={product} />
          ) : (
            <ProductCard key={product.id} product={product} />
          ),
        )}
    </div>
  )
}
