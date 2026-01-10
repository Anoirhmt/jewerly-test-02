"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

