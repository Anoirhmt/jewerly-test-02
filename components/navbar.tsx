"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/cart-context"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items } = useCart()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="Elarain Jewelry" width={150} height={60} className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link
              href="/"
              className="text-gray-800 hover:text-black transition-all duration-300 font-light text-sm tracking-[0.15em] uppercase relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/products"
              className="text-gray-800 hover:text-black transition-all duration-300 font-light text-sm tracking-[0.15em] uppercase relative group"
            >
              Collection
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/packs"
              className="text-gray-800 hover:text-black transition-all duration-300 font-light text-sm tracking-[0.15em] uppercase relative group"
            >
              Luxury Packs
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Cart Button */}
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-black text-white">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-black transition-colors font-light">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-black transition-colors font-light">
                Collection
              </Link>
              <Link href="/packs" className="text-gray-700 hover:text-black transition-colors font-light">
                Luxury Packs
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
