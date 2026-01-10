'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Playfair_Display, Lora, Architects_Daughter } from "next/font/google";
import { motion } from "framer-motion";

const playfair = Playfair_Display({ weight: ["700"], subsets: ["latin"] });
const lora = Lora({ weight: ["400"], style: ["italic"], subsets: ["latin"] });
const architects = Architects_Daughter({ weight: ["400"], subsets: ["latin"] });

export function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-60"
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
            iframe.className = 'absolute inset-0 w-full h-full opacity-60'
            iframe.src = 'https://www.youtube.com/embed/W5PRZuaQ3VM?autoplay=1&mute=1&loop=1&playlist=W5PRZuaQ3VM&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1'
            iframe.title = 'Background video'
            iframe.allow = 'autoplay; encrypted-media'
            iframe.style.pointerEvents = 'none'
            container.replaceChildren(iframe)
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white" />

      {/* Content */}
      <article className="relative z-10 container mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-4xl flex flex-col items-center gap-8"
        >
          <Image
            src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/elarain_jewelry_text_only.png"
            alt="Elarain Jewelry Logo"
            width={700}
            height={300}
            priority
            className="w-auto h-40 sm:h-56 object-contain brightness-0 invert"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-white/80 text-lg sm:text-xl tracking-[0.3em] uppercase font-serif"
          >
            L'Élégance Redéfinie
          </motion.p>

          <Link href="/packs" passHref>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="px-12 py-6 text-sm bg-white text-black hover:bg-gray-100 rounded-none uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl"
              >
                Découvrir la Collection
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </article>
    </section>
  );
}
