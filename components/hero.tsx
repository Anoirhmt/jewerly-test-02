'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Playfair_Display, Lora, Architects_Daughter } from "next/font/google";

const playfair = Playfair_Display({ weight: ["700"], subsets: ["latin"] });
const lora = Lora({ weight: ["400"], style: ["italic"], subsets: ["latin"] });
const architects = Architects_Daughter({ weight: ["400"], subsets: ["latin"] });

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
      <div className="absolute inset-0 bg-black/40" />
      {/* Bottom Gradient Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white/90" />

      {/* Content */}
      <article className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <header className="max-w-4xl flex flex-col items-start gap-4">
          <Image
            src="https://drive.google.com/uc?export=view&id=1PLkL-khSK6jEvcQuUZnbRycrf7zV0C4H"
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
