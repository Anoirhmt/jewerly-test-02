'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Playfair_Display, Lora, Architects_Daughter } from "next/font/google";

const playfair = Playfair_Display({ weight: ["700"], subsets: ["latin"] });
const lora = Lora({ weight: ["400"], style: ["italic"], subsets: ["latin"] });
const architects = Architects_Daughter({ weight: ["400"], subsets: ["latin"] });

export function Hero() {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero.mp4"
          playsInline
          autoPlay
          muted
          loop
          preload="auto"
          style={{ pointerEvents: "none" }}
          onError={(e) => {
            const container = (e.currentTarget.parentElement as HTMLElement)
            if (!container) return
            const iframe = document.createElement('iframe')
            iframe.className = 'absolute inset-0 w-full h-full'
            iframe.src = 'https://www.youtube.com/embed/W5PRZuaQ3VM?autoplay=1&mute=1&loop=1&playlist=W5PRZuaQ3VM&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1'
            iframe.title = 'Background video'
            iframe.allow = 'autoplay; encrypted-media'
            iframe.style.pointerEvents = 'none'
            container.replaceChildren(iframe)
          }}
        />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white/90" />

      {/* Content */}
      <article className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <header className="max-w-4xl flex flex-col items-start gap-4">
          <Image
            src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/elarain_jewelry_text_only.png"
            alt="Elarain Jewelry Logo"
            width={700}
            height={300}
            priority
            className="w-auto h-32 sm:h-48 object-contain"
          />
          {/* Hidden text for accessibility/SEO */}
          <span className="sr-only">Elarain Jewelry</span>

          {/* CTA Button */}
          <Link href="/packs" passHref>
            <Button variant="secondary"
              className={`${architects.className} px-8 py-4 text-lg sm:px-12 sm:py-5 sm:text-xl bg-gradient-to-br from-white to-gray-100 border-2 border-[#ffc107] text-[#2c2c2c] rounded-[10px] shadow-[4px_4px_0_0_#b3b3b3] transition-all duration-300 hover:bg-[#ffc107] hover:text-[#2c2c2c] hover:shadow-[0_0_12px_#ffc10780,2px_2px_0_0_#999] hover:translate-x-[2px] hover:translate-y-[2px]`}>
              Voir le pack
            </Button>
          </Link>
        </header>
      </article>
    </section>
  );
}
