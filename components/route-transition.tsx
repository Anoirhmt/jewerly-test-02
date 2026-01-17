"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

