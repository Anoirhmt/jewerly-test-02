import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-jewelry.jpg"
          alt="Elarain Jewelry Collection"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="max-w-4xl text-white">
          <h1 className="text-6xl md:text-8xl font-serif font-light mb-8 tracking-tight leading-none">
            <span className="gold-accent">Elarain</span>
            <span className="block font-normal italic text-white">Jewelry</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 font-light leading-relaxed max-w-2xl">
            Découvrez notre collection exclusive de bijoux de luxe. Chaque pièce raconte une histoire d'élégance et de
            sophistication intemporelle.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/products">
              <Button
                size="lg"
                className="premium-button text-white px-16 py-6 text-lg font-medium tracking-[0.15em] rounded-none uppercase"
              >
                Découvrir la Collection
              </Button>
            </Link>
            <Link href="/packs">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black bg-transparent px-16 py-6 text-lg font-medium tracking-[0.15em] rounded-none uppercase transition-all duration-500"
              >
                Voir les Packs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm font-light mb-2 tracking-wider">DÉCOUVRIR</span>
          <div className="w-px h-8 bg-white"></div>
        </div>
      </div>
    </section>
  )
}
