"use client"

import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative w-full h-[85vh] sm:h-screen overflow-hidden bg-black">
      {/* Background with Clear View */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url('/Gemini_Generated_Image_sfxyzbsfxyzbsfxy (1) (1).png')",
            backgroundPosition: "center 40%",
          }}
        />

        {/* Simple cinematic vignette for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        {/* Elarain Logo in Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-12"
        >
          <span className="text-[10px] sm:text-[12px] tracking-[0.8em] uppercase text-[#c5a367] font-medium drop-shadow-md">
            E L A R A I N
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-playfair italic text-4xl sm:text-6xl md:text-8xl text-white mb-8 tracking-wide drop-shadow-2xl"
        >
          L'Art de l'Éternité
        </motion.h1>

      </div>

      {/* Elegant fade at the very bottom with Pure White Solid-to-Transparent Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none">
        {/* The "Smoke/Mist" look is achieved with a shorter white gradient that fades into the page */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />

        {/* Subtle extra layer of soft white glow for the "misty" feel */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white/10 blur-[40px]" />
      </div>
    </section>
  )
}
