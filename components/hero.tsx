"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ScrollytellingCanvas, { useScrollytelling } from "@/components/ScrollytellingCanvas";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameCount = 40;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frame = useScrollytelling(frameCount, scrollYProgress);

  // --- TEXT ANIMATION TRANSFORMS ---

  // Section 1: Hero Logo (0% - 15%)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  // Section 2: Feature #1 (20% - 50%)
  const feature1Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.45, 0.5], [0, 1, 1, 0]);
  const feature1X = useTransform(scrollYProgress, [0.15, 0.25, 0.5], [-30, 0, 30]);

  // Section 3: Feature #2 (55% - 80%)
  const feature2Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.8], [0, 1, 1, 0]);
  const feature2X = useTransform(scrollYProgress, [0.55, 0.65, 0.8], [30, 0, -30]);

  // Section 4: Final CTA (85% - 100%)
  const finalOpacity = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const finalScale = useTransform(scrollYProgress, [0.8, 0.95], [0.95, 1]);

  // Section 5: Canvas Fade Out (95% - 100%)
  const canvasOpacity = useTransform(scrollYProgress, [0.95, 1], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-white">
      {/* THE STICKY CONTAINER FOR CANVAS AND OVERLAYS */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ opacity: canvasOpacity }} className="h-full w-full">
          <ScrollytellingCanvas
            frameCount={frameCount}
            framePrefix="frame_"
            frameExtension="jpg"
            frame={frame}
          />
        </motion.div>

        {/* THE CINEMATIC OVERLAYS (Now absolute within sticky container) */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">

          {/* 0% - 15% : THE INTRODUCTION - REMOVED AS REQUESTED */}


          {/* 25% - 45% : FEATURE #1 (Left Aligned) */}
          <motion.div
            style={{ opacity: feature1Opacity, x: feature1X }}
            className="absolute left-10 top-1/2 -translate-y-1/2 max-w-sm text-left sm:left-32 md:max-w-md"
          >
            <span className="text-[9px] tracking-luxury-lg uppercase text-white/30 mb-6 block font-medium">01. Précision</span>
            <h2 className="text-4xl font-serif font-medium tracking-luxury text-white sm:text-7xl leading-[1.1] uppercase">
              La Pureté <br /> <span className="text-white/40">Absolue</span>
            </h2>
            <div className="mt-8 h-[1px] w-16 bg-white/10" />
            <p className="mt-10 text-[11px] leading-relaxed-extra tracking-luxury text-white/50 font-light max-w-xs italic">
              "Chaque facette capture la lumière pour raconter une histoire de précision infinie, où le métal rencontre la perfection absolue."
            </p>
          </motion.div>

          {/* 55% - 80% : FEATURE #2 (Right Aligned) */}
          <motion.div
            style={{ opacity: feature2Opacity, x: feature2X }}
            className="absolute right-10 top-1/2 -translate-y-1/2 max-w-sm text-right sm:right-32 md:max-w-md"
          >
            <span className="text-[9px] tracking-luxury-lg uppercase text-white/30 mb-6 block font-medium">02. Structure</span>
            <h2 className="text-4xl font-serif font-medium tracking-luxury text-white sm:text-7xl leading-[1.1] uppercase">
              L'Équilibre <br /> <span className="text-white/40">du Geste</span>
            </h2>
            <div className="mt-8 h-[1px] w-16 bg-white/10 ml-auto" />
            <p className="mt-10 text-[11px] leading-relaxed-extra tracking-luxury text-white/50 font-light max-w-xs ml-auto italic">
              "Une ingénierie secrète qui danse au rythme de vos instants. Le luxe n'est pas une parure, c'est une émotion qui se porte."
            </p>
          </motion.div>

          {/* 85% - 100% : THE FINALE */}
          <motion.div
            style={{ opacity: finalOpacity, scale: finalScale }}
            className="flex flex-col items-center gap-12"
          >
            <div className="flex flex-col items-center gap-6">
              <span className="text-[9px] tracking-luxury-lg uppercase text-white/30 mb-2 block font-medium">03. Éternité</span>
              <h2 className="text-6xl font-serif font-medium tracking-luxury-xl uppercase text-white sm:text-9xl text-center">
                L'Éclat <br /> <span className="text-white/40 italic">Suprême</span>
              </h2>
              <div className="mt-4 h-[1px] w-16 bg-white/10 mx-auto" />
              <p className="max-w-lg text-[9px] tracking-luxury-xl text-white/30 uppercase ml-[1em] font-light">
                Redéfinir l'Héritage du Luxe Moderne
              </p>
            </div>

            <Link href="/products" className="pointer-events-auto mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-5 bg-white text-black text-[10px] tracking-luxury-xl uppercase font-light hover:bg-white/90 transition-all duration-700"
              >
                Découvrir la Collection
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator (Now absolute within sticky container) */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-6"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/20 to-white/0" />
          <span className="text-[8px] tracking-luxury-xl uppercase text-white/30 font-light">Défiler</span>
        </motion.div>
      </div>

      {/* THE SMOKE GRADIENT (Now outside sticky, fixed to the bottom of the section) */}
      <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-t from-white via-white/90 via-white/40 to-transparent z-40 pointer-events-none" />
    </section>
  );
}
