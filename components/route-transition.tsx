"use client"

import React from "react"
import { usePathname } from "next/navigation"

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [progress, setProgress] = React.useState(0)
  const [showBar, setShowBar] = React.useState(false)
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    setShowBar(true)
    setProgress(10)
    const t1 = setTimeout(() => setProgress(60), 80)
    const t2 = setTimeout(() => setProgress(85), 200)
    const t3 = setTimeout(() => setProgress(100), 300)
    const t4 = setTimeout(() => setShowBar(false), 500)

    setVisible(false)
    const t5 = setTimeout(() => setVisible(true), 0)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [pathname])

  return (
    <div className="relative">
      {showBar && (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <div
            className="h-0.5 bg-[#ffc107] shadow-[0_0_8px_#ffc10780] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`} key={pathname}>
        {children}
      </div>
    </div>
  )
}

