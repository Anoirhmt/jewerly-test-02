import { ProductCard } from "./product-card"
import { PackCard } from "./pack-card"
import Link from "next/link"
import Image from "next/image"

interface ProductGridProps {
  products: any[]
  showNavCards?: boolean
}

export function ProductGrid({ products, showNavCards = false }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
      {showNavCards && (
        <>
          {/* Packs nav card — full width on mobile */}
          <NavCard
            href="/packs"
            src="/Yourtext.png"
            alt="Voir les packs"
            label="Packs Exclusifs"
            cta="Découvrir"
          />

          {/* Collection nav card */}
          <NavCard
            href="/products"
            src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/PinDown.io_%40jussttagiirl_1758252111%20(1).jpg"
            alt="Notre collection"
            label="Collection Bijoux"
            cta="Explorer"
          />

          {/* Watches nav card */}
          <NavCard
            href="/watches"
            src="/Yourtext (1).png"
            alt="Nos montres"
            label="Montre Pour Femme"
            cta="Voir tout"
            objectPosition="center center"
          />
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

/* ─────────────────────────────────────────────────── */
/* NavCard — simple, clean card like product cards    */
/* ─────────────────────────────────────────────────── */
function NavCard({
  href,
  src,
  alt,
  label,
  cta,
  objectPosition = "center",
}: {
  href: string
  src: string
  alt: string
  label: string
  cta: string
  objectPosition?: string
}) {
  return (
    <div className="col-span-1 md:col-span-1 xl:col-span-1 group">
      <Link href={href} className="block active:opacity-90 transition-opacity">

        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F7F5]">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            style={{ objectPosition }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

        </div>

        {/* Label + CTA below */}
        <div className="pt-3 pb-2 text-center">
          <h3 className="text-[10px] sm:text-[11px] font-medium text-black uppercase tracking-[0.15em] leading-snug mb-1.5">
            {label}
          </h3>
          <span className="text-[8px] tracking-[0.3em] uppercase text-[#9b5c5c] font-light">
            {cta} →
          </span>
        </div>
      </Link>
    </div>
  )
}
