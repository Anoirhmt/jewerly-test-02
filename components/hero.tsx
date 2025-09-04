'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"


export function Hero() {
  
  
  return (
    <section className="relative h-[50vh] sm:h-[100dvh] min-h-[300px] sm:min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://drive.google.com/uc?export=view&id=1KIcQj46EItlsooVyvdQYaZ9hl5_kZP1U"
        alt="Elarain Luxury Jewelry Collection"
        fill
        className="object-cover object-center"
        priority
        quality={70}
        sizes="100vw"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      {/* Bottom Gradient Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white/90"></div>

      {/* Content */}
      <article className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <header className="max-w-4xl text-white">
          <h1 className="text-6xl md:text-8xl font-serif font-light mb-8 tracking-tight leading-none">
            <span className="gold-accent">Elarain</span>
            <span className="block font-normal italic text-white">Jewelry</span>
          </h1>
          <nav className="flex flex-col sm:flex-row gap-6">
            <Button
              asChild
              size="lg"
              className="premium-button text-white px-16 py-6 text-lg font-medium tracking-[0.15em] rounded-none uppercase"
            >
              <Link href="/products">Découvrir la Collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black bg-transparent px-16 py-6 text-lg font-medium tracking-[0.15em] rounded-none uppercase transition-all duration-500"
            >
              <Link href="/packs">Voir les Packs</Link>
            </Button>
          </nav>
        </header>
      </article>


    </section>
  )
}
