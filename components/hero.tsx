'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"


export function Hero() {
  
  
  return (
    <section className="relative h-[50vh] sm:h-[100dvh] min-h-[300px] sm:min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://drive.google.com/uc?export=view&id=1yRxUQ1kG6J6WRiltRCEvqmzQIozmI5wo"
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

        </header>
      </article>


    </section>
  )
}
