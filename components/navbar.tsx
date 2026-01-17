"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Menu, X, Search } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items, setCartOpen } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const isSpecialPage = ["211"].includes(pathname.split('/').pop() || "")


  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q.length > 0) {
      router.push(`/products?search=${encodeURIComponent(q)}`)
      setSearchOpen(false)
    }
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-700 ease-in-out bg-white/80 backdrop-blur-xl border-b border-black/[0.03] py-0">
      <div className="w-full px-8 md:px-12">
        <div className="flex items-center justify-between transition-all duration-700 h-20 md:h-24">
          {/* Mobile menu button */}
          {!isSpecialPage && (
            <div className="flex md:hidden flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent p-0 h-auto w-auto transition-colors duration-700 text-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-4 w-4 stroke-[1.5]" /> : <Menu className="h-4 w-4 stroke-[1.5]" />}
              </Button>
            </div>
          )}

          {/* Desktop Navigation - Left */}
          {!isSpecialPage && (
            <div className="hidden md:flex flex-1 items-center space-x-12">
              {[
                { name: "Accueil", href: "/" },
                { name: "Collection", href: "/products" },
                { name: "Packs", href: "/packs" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[10px] tracking-luxury-lg uppercase transition-all duration-700 relative group py-2 ${pathname === link.href
                    ? "text-black font-medium"
                    : "text-black/40 hover:text-black"
                    }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[1px] transition-all duration-700 ease-in-out bg-black ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                </Link>
              ))}
            </div>
          )}

          {/* Logo - Centered */}
          <div className="flex justify-center md:flex-initial transition-all duration-1000 opacity-100 scale-100 translate-y-0">
            <Link href="/" className="flex items-center group px-4">
              <Image
                src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/elarain_jewelry_text_only.png"
                alt="Elarain Jewelry"
                width={200}
                height={80}
                priority
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="h-8 md:h-10 w-auto transition-all duration-1000 group-hover:opacity-70 select-none brightness-0"
              />
            </Link>
          </div>

          {/* Right side container */}
          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-8">
            {!isSpecialPage && (
              <>
                <div className="relative flex items-center">
                  <AnimatePresence>
                    {searchOpen && (
                      <motion.form
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        onSubmit={handleSearch}
                        className="absolute right-10 flex items-center bg-transparent border-b px-0 py-1 transition-colors duration-700 border-black/10"
                      >
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="RECHERCHER"
                          className="bg-transparent outline-none text-[9px] tracking-luxury w-28 md:w-40 uppercase transition-colors duration-700 text-black placeholder:text-black/20"
                          autoFocus
                        />
                      </motion.form>
                    )}
                  </AnimatePresence>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent p-0 h-auto w-auto transition-all duration-500 hover:scale-110 text-black"
                    onClick={() => setSearchOpen(!searchOpen)}
                  >
                    {searchOpen ? <X className="h-4 w-4 stroke-[1.5]" /> : <Search className="h-4 w-4 stroke-[1.5]" />}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-transparent p-0 h-auto w-auto transition-all duration-500 hover:scale-110 text-black"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingCart className="h-4 w-4 stroke-[1.5]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 flex items-center justify-center text-[7px] rounded-full font-bold shadow-soft bg-black text-white">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {!isSpecialPage && isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-black/[0.03]"
            >
              <div className="flex flex-col py-10 space-y-6 text-center">
                {[
                  { name: "Accueil", href: "/" },
                  { name: "Collection", href: "/products" },
                  { name: "Packs de Luxe", href: "/packs" },
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-[10px] tracking-luxury-lg uppercase text-black/60 hover:text-black transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
