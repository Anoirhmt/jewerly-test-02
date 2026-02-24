"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, Search } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { items, setCartOpen } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const isSpecialPage = ["211"].includes(pathname.split('/').pop() || "")

  useEffect(() => {
    setIsMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q.length > 0) {
      router.push(`/products?search=${encodeURIComponent(q)}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Collection", href: "/products" },
    { name: "Montres", href: "/watches" },
    { name: "Packs", href: "/packs" },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled
          ? "bg-white/95 backdrop-blur-2xl border-b border-black/[0.05] shadow-glass"
          : "bg-white/80 backdrop-blur-xl border-b border-transparent"
        }`}
    >
      {/* ── Announcement strip — hidden when scrolled ── */}
      <div
        className={`w-full overflow-hidden transition-all duration-500 ${scrolled ? "h-0 opacity-0 pointer-events-none" : "h-8 opacity-100"
          }`}
      >
        <div className="flex items-center justify-center h-8 bg-[#9b5c5c]">
          <div className="overflow-hidden max-w-full">
            <div className="marquee-track flex items-center">
              {Array(8).fill(null).map((_, i) => (
                <span
                  key={i}
                  className="text-[7px] tracking-[0.35em] uppercase text-white/80 font-light px-6 shrink-0 whitespace-nowrap"
                >
                  Livraison Express&nbsp;&nbsp;·&nbsp;&nbsp;Paiement à la Livraison&nbsp;&nbsp;·&nbsp;&nbsp;Bijoux Premium
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-12">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-[4.5rem]">

          {/* Mobile hamburger */}
          {!isSpecialPage && (
            <div className="flex md:hidden flex-1">
              <button
                className="p-2 -ml-2 touch-manipulation text-black/60 active:text-black transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="h-5 w-5 stroke-[1.5]" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu className="h-5 w-5 stroke-[1.5]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          )}

          {/* Desktop Nav — Left */}
          {!isSpecialPage && (
            <div className="hidden md:flex flex-1 items-center space-x-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[9px] tracking-luxury-lg uppercase transition-all duration-500 relative group py-1 ${isActive ? "text-black font-medium" : "text-black/40 hover:text-black"
                      }`}
                  >
                    {link.name}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-[1px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? "w-full bg-[#9b5c5c]" : "w-0 group-hover:w-full bg-black"
                        }`}
                    />
                  </Link>
                )
              })}
            </div>
          )}

          {/* Logo — Center */}
          <div className={`flex justify-center md:flex-initial transition-all duration-500 ${searchOpen ? "opacity-0 invisible" : "opacity-100 visible"}`}>
            <Link href="/" className="flex items-center group px-3">
              <Image
                src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/elarain_jewelry_text_only.png"
                alt="Elarain Jewelry"
                width={200}
                height={80}
                priority
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="h-5 sm:h-6 md:h-9 w-auto transition-opacity duration-700 group-hover:opacity-60 select-none brightness-0"
              />
            </Link>
          </div>

          {/* Right side */}
          <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4 md:gap-7">
            {!isSpecialPage && (
              <>
                {/* Search */}
                <div className="relative flex items-center">
                  <AnimatePresence>
                    {searchOpen && (
                      <motion.form
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        onSubmit={handleSearch}
                        className="absolute right-8 flex items-center border-b border-black/15 pb-1"
                      >
                        <input
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Rechercher…"
                          className="bg-transparent outline-none text-[10px] w-36 sm:w-48 md:w-64 text-black placeholder:text-black/25 font-light"
                          autoFocus
                          autoComplete="off"
                        />
                      </motion.form>
                    )}
                  </AnimatePresence>
                  <button
                    className="p-2 -mr-2 touch-manipulation text-black/50 hover:text-[#9b5c5c] active:text-[#9b5c5c] transition-colors"
                    onClick={() => setSearchOpen(!searchOpen)}
                    aria-label={searchOpen ? "Fermer" : "Rechercher"}
                  >
                    {searchOpen
                      ? <X className="h-[17px] w-[17px] stroke-[1.5]" />
                      : <Search className="h-[17px] w-[17px] stroke-[1.5]" />
                    }
                  </button>
                </div>

                {/* Cart */}
                <button
                  className="relative p-2 -mr-2 touch-manipulation text-black/50 hover:text-[#9b5c5c] active:text-[#9b5c5c] transition-colors"
                  onClick={() => setCartOpen(true)}
                  aria-label="Ouvrir le panier"
                >
                  <ShoppingCart className="h-[18px] w-[18px] stroke-[1.5]" />
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        key={itemCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                        className="absolute top-0.5 right-0.5 h-4 w-4 flex items-center justify-center text-[7px] rounded-full font-bold bg-[#9b5c5c] text-white"
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        <AnimatePresence>
          {!isSpecialPage && isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-black/[0.04]"
            >
              {/* Full-size touch links */}
              <nav className="flex flex-col py-2">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center justify-between px-2 py-4 text-[11px] tracking-[0.35em] uppercase font-medium transition-colors active:bg-black/[0.02] ${isActive ? "text-[#9b5c5c]" : "text-black/50"
                          }`}
                      >
                        <span className="flex items-center gap-3">
                          {isActive && <span className="w-3 h-[1px] bg-[#9b5c5c]" />}
                          {link.name}
                        </span>
                        <span className="text-black/20 text-base">›</span>
                      </Link>
                      <div className="h-[1px] bg-black/[0.03] mx-2" />
                    </motion.div>
                  )
                })}
              </nav>

              {/* Quick actions at bottom */}
              <div className="px-2 py-4 flex items-center gap-3">
                <a
                  href="https://wa.me/212693011454"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#9b5c5c] text-white text-[9px] tracking-[0.3em] uppercase font-medium rounded-sm active:opacity-90 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
