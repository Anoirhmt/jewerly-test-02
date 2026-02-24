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
            src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/PinDown.io_%40777mbalenhle_1758181598%20(1).jpg"
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
            src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/PinDown.io_%40maddyy_r_1757043506%20(1)%20(1).jpg"
            alt="Nos montres"
            label="Haute Horlogerie"
            cta="Voir tout"
            objectPosition="center 70%"
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
/* NavCard — mobile-first, full-width on small screens */
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
    /* col-span-2 = full width on 2-col mobile grid; md:col-span-1 so 3 per row on md */
    <div className="col-span-2 md:col-span-1 xl:col-span-2 group">
      <Link
        href={href}
        className="relative block w-full overflow-hidden bg-[#F2EEE8]"
        /* taller on mobile so image breathes */
        style={{ aspectRatio: "16/9" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] active:scale-[1.02]"
          style={{ objectPosition }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient scrim — always visible on mobile (no hover needed) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[7px] sm:text-[8px] tracking-[0.4em] uppercase text-white/60 mb-1 font-light">
              Elarain
            </p>
            <p className="text-sm sm:text-sm md:text-base tracking-[0.12em] uppercase text-white font-semibold leading-tight">
              {label}
            </p>
          </div>

          {/* CTA chip — always solid on mobile (bg-white by default, not hover-only) */}
          <span className="shrink-0 bg-white text-black text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm whitespace-nowrap transition-all duration-300 active:bg-[#9b5c5c] active:text-white">
            {cta} →
          </span>
        </div>
      </Link>
    </div>
  )
}
