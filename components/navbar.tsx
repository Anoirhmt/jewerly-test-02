"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Menu, X, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/cart-context"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items } = useCart()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (searchOpen) {
      const q = searchQuery.trim()
      if (q.length > 0) {
        router.push(`/products?search=${encodeURIComponent(q)}`)
      }
    }
  }, [searchQuery, searchOpen, router])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/90">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          {/* Mobile menu button - will be on the left */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="hover:bg-gray-50/50 transition-colors duration-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5 text-gray-800" /> : <Menu className="h-5 w-5 text-gray-800" />}
            </Button>
          </div>

          {/* Logo for Desktop - will be on the left */}
          <div className="hidden md:block">
            <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-[1.02]">
              <Image src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/erasebg-transformed%20(1)%20(1).png" alt="Elarain Jewelry" width={240} height={96} className="h-20 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-16">
            <Link
              href="/"
              className="text-gray-600 hover:text-black/90 transition-all duration-200 font-medium text-sm tracking-wider uppercase relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/products"
              className="text-gray-600 hover:text-black/90 transition-all duration-200 font-medium text-sm tracking-wider uppercase relative group"
            >
              Collection
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/packs"
              className="text-gray-600 hover:text-black/90 transition-all duration-200 font-medium text-sm tracking-wider uppercase relative group"
            >
              Luxury Packs
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Right side container */}
          <div className="flex items-center space-x-4 relative">
            {/* Logo for Mobile */}
            <div className="md:hidden">
              <Link href="/" className="flex items-center">
                <Image src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/erasebg-transformed%20(1)%20(1).png" alt="Elarain Jewelry" width={240} height={96} className="h-20 w-auto" />
              </Link>
            </div>

            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-50/50 transition-colors duration-300"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
             </Button>
            {searchOpen && (
              <div className="absolute right-14 md:right-16 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full flex items-center shadow-lg px-4 transition-all duration-300 focus-within:ring-2 focus-within:ring-black">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Recherche"
                  className="outline-none text-sm w-52 md:w-64 bg-transparent placeholder-gray-400 flex-1"
                   autoFocus
                 />
                 <button onClick={() => setSearchOpen(false)} className="p-1 text-gray-500 hover:text-gray-800 transition-colors">
                   <X className="h-4 w-4" />
                 </button>
              </div>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-50/50 transition-colors duration-300">
                <ShoppingCart className="h-5 w-5 text-gray-800" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-sm">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-in fade-in duration-200">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="block py-3 text-center text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-all duration-200">
                Home
              </Link>
              <Link href="/products" className="block py-3 text-center text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-all duration-200">
                Collection
              </Link>
              <Link href="/packs" className="block py-3 text-center text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-all duration-200">
                Luxury Packs
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
