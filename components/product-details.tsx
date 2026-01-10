"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent } from "@/components/ui/drawer"

import { ShoppingCart, Minus, Plus, ChevronRight, Share2, Heart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/utils/format-price"
import type { Product } from "@/data/products"
import { motion, AnimatePresence } from "framer-motion"

// Helper mapping common color names to hex codes for swatch backgrounds
const getColorHex = (name: string): string => {
  const normalized = name.toLowerCase().trim().replace(/\s+/g, "");
  
  const map: Record<string, string> = {
    rouge: "#FF0000",
    red: "#800000",
    bleu: "#0000FF",
    blue: "#0000FF",
    vert: "#008000",
    green: "#008000",
    jaune: "#FFFF00",
    yellow: "#FFFF00",
    noir: "#000000",
    black: "#000000",
    blanc: "#FFFFFF",
    white: "#FFFFFF",
    gold: "#FFD366",
    or: "#D4AF37",
    rosegold: "#B76E79",
    orrose: "#B76E79",
    silver: "#C0C0C0",
    argent: "#C0C0C0",
  };
  
  return map[normalized] ?? name;
};

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState<string>(
    product.image ?? product.variants?.[0]?.image ?? "/placeholder.svg"
  )
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.variants?.[0]?.color)
  const [isZoomed, setIsZoomed] = useState(false)

  const { addItem, items } = useCart()
  const router = useRouter()

  const [isDrawerOpen, setDrawerOpen] = useState(false)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, { selectedColor, selectedImage: activeImage })
    }
    setDrawerOpen(true)
  }

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, { selectedColor, selectedImage: activeImage })
    }
    router.push("/checkout")
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-12">
        <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-black transition-colors">{product.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Image Section */}
        <div className="space-y-6">
          <div
            className="relative aspect-[4/5] overflow-hidden bg-[#f9f9f9] cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={activeImage || "/placeholder.svg"}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-700 ${isZoomed ? "scale-150" : "scale-100"}`}
              />
            </AnimatePresence>
            
            {discountPercentage > 0 && (
              <Badge className="absolute top-6 left-6 bg-black text-white border-0 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium rounded-none">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-4">
            {product.variants?.map((variant) => (
              <button
                key={variant.color}
                onClick={() => { setActiveImage(variant.image); setSelectedColor(variant.color) }}
                className={`relative aspect-square overflow-hidden bg-[#f9f9f9] border transition-all duration-300 ${activeImage === variant.image ? "border-black" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <img src={variant.image} alt={variant.color} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col"
        >
          <div className="mb-8 border-b border-gray-100 pb-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-4 font-serif">
              {product.category}
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-medium tracking-luxury mb-6 text-black uppercase">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-6">
              <span className="text-2xl font-light text-black tracking-widest">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through font-light">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>

          <div className="space-y-10 flex-grow">
            {/* Description */}
            <p className="text-gray-600 leading-relaxed-extra text-lg font-light">
              {product.description}
            </p>

            {/* Variant selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-black font-medium">Couleur: <span className="text-gray-400 ml-2">{selectedColor}</span></p>
                </div>
                <div className="flex space-x-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.color}
                      type="button"
                      aria-label={variant.color}
                      onClick={() => { setActiveImage(variant.image); setSelectedColor(variant.color) }}
                      className={`h-10 w-10 rounded-full border transition-all duration-300 flex items-center justify-center ${selectedColor === variant.color ? "border-black scale-110" : "border-gray-200 hover:border-gray-400"}`}
                    >
                      <div 
                        className="h-7 w-7 rounded-full shadow-inner"
                        style={{ backgroundColor: getColorHex(variant.color) }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-8 border-t border-b border-gray-100 py-8">
              {product.material && (
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Matériau</p>
                  <p className="text-sm text-black font-light">{product.material}</p>
                </div>
              )}
              {product.gemstone && (
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Pierre</p>
                  <p className="text-sm text-black font-light">{product.gemstone}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <p className="text-[10px] tracking-[0.2em] uppercase text-black font-medium">Quantité</p>
                <div className="flex items-center border border-gray-200 h-12">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="rounded-none hover:bg-transparent"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-6 text-sm font-light">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="rounded-none hover:bg-transparent"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleBuyNow}
                  className="bg-black text-white px-8 py-7 text-[10px] tracking-[0.3em] rounded-none uppercase transition-all duration-500 hover:bg-gray-900"
                  disabled={!product.inStock}
                >
                  Acheter maintenant
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="border-black text-black px-8 py-7 text-[10px] tracking-[0.3em] rounded-none uppercase transition-all duration-500 hover:bg-black hover:text-white"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-3" />
                  Ajouter au panier
                </Button>
              </div>
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="mt-12 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-gray-400">
            <button className="flex items-center hover:text-black transition-colors">
              <Heart className="h-3 w-3 mr-2" /> Liste de souhaits
            </button>
            <button className="flex items-center hover:text-black transition-colors">
              <Share2 className="h-3 w-3 mr-2" /> Partager
            </button>
          </div>
        </motion.div>
      </div>

      {/* Cart Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="p-4">
          <h2 className="text-lg font-semibold">Récapitulatif du panier</h2>
          <ul className="mt-2 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500 text-xs">Qté : {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4 font-medium">
            <span>Sous-total:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Button onClick={() => router.push('/checkout')} className="mt-4 w-full">
            Acheter maintenant
          </Button>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link href="/cart">
              <Button variant="outline" className="w-full rounded-none">
                Voir le panier
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="ghost" className="w-full rounded-none">
                Continuer vos achats
              </Button>
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

