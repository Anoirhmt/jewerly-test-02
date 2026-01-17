"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent } from "@/components/ui/drawer"

import { ShoppingCart, Minus, Plus, ChevronRight, Share2 } from "lucide-react"
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
    argenté: "#C0C0C0",
    doré: "#D4AF37",
    signature: "#B25E5E",
    vintage: "#F5E6C4",
  };

  return map[normalized] ?? name;
};

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState<string>(
    product.image ?? product.variants?.[0]?.image ?? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNGOEY4RjgiLz48L3N2Zz4="
  )
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.variants?.[0]?.color)
  const [isZoomed, setIsZoomed] = useState(false)

  const { addItem, items } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    addItem(product, { selectedColor, selectedImage: activeImage, quantity })
  }

  const handleBuyNow = () => {
    addItem(product, { selectedColor, selectedImage: activeImage, quantity })
    router.push("/checkout")
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Découvrez ${product.name} sur Elarain Archive`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Lien copié dans le presse-papiers !")
    }
  }

  return (
    <div className="w-full px-6 sm:px-12 lg:px-16 py-20 lg:py-32">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-3 text-[9px] tracking-luxury uppercase text-black/30 mb-16 md:mb-24">
        <Link href="/" className="hover:text-black transition-colors duration-500">Accueil</Link>
        <span className="w-4 h-[1px] bg-black/10" />
        <Link href="/products" className="hover:text-black transition-colors duration-500">{product.category}</Link>
        <span className="w-4 h-[1px] bg-black/10" />
        <span className="text-black font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
        {/* Product Image Section */}
        <div className="space-y-10">
          <div
            className="relative aspect-[4/5] overflow-hidden bg-luxury-cream cursor-zoom-in group shadow-soft hover:shadow-luxury transition-all duration-1000"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{
                  opacity: 1,
                  scale: isZoomed ? 1.5 : 1
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  opacity: { duration: 0.8, ease: "easeInOut" },
                  scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
                }}
                src={activeImage || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNGOEY4RjgiLz48L3N2Zz4="}
                alt={product.name}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none"
              />
            </AnimatePresence>

            {discountPercentage > 0 && (
              <Badge className="absolute top-4 left-4 md:top-8 md:left-8 bg-white/95 backdrop-blur-sm text-black border-0 px-3 py-1 md:px-5 md:py-2 text-[8px] md:text-[9px] tracking-luxury-lg uppercase font-medium rounded-full z-10 shadow-luxury">
                -{discountPercentage}%
              </Badge>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.01] transition-colors duration-700 pointer-events-none" />
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-6">
            {product.variants?.map((variant) => (
              <button
                key={variant.color}
                onClick={() => { setActiveImage(variant.image); setSelectedColor(variant.color) }}
                className={`relative aspect-square overflow-hidden bg-luxury-cream transition-all duration-700 ease-in-out border ${activeImage === variant.image ? "border-black shadow-soft" : "border-transparent opacity-50 hover:opacity-100 hover:border-black/10"}`}
                onContextMenu={(e) => e.preventDefault()}
              >
                <img
                  src={variant.image}
                  alt={variant.color}
                  draggable={false}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 select-none"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:pt-4"
        >
          <div className="mb-12 space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] tracking-luxury-xl uppercase text-black/30 font-light">
                {product.category}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-luxury text-black uppercase leading-[1.1]">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center space-x-8">
              <span className="text-2xl lg:text-3xl font-light text-black tracking-luxury-lg">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-black/20 line-through font-light tracking-luxury">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="w-16 h-[1px] bg-black/10" />
          </div>

          <div className="space-y-16 flex-grow">
            {/* Variant selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-8">
                <p className="text-[10px] tracking-luxury-lg uppercase text-black/40 font-medium">Finish Archive</p>
                <div className="flex items-start space-x-10">
                  {product.variants.map((variant) => {
                    const isActive = selectedColor === variant.color;
                    return (
                      <button
                        key={variant.color}
                        type="button"
                        aria-label={variant.color}
                        onClick={() => { setActiveImage(variant.image); setSelectedColor(variant.color) }}
                        className="group flex flex-col items-center gap-4 outline-none"
                      >
                        <div className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-700 ease-out ${isActive ? "border border-black shadow-luxury" : "border border-black/5 group-hover:border-black/20"}`}>
                          <div
                            className={`w-10 h-10 rounded-full shadow-inner transition-all duration-700 ${isActive ? "scale-90" : "scale-100 group-hover:scale-105"}`}
                            style={{
                              backgroundColor: getColorHex(variant.color),
                              boxShadow: isActive ? `0 6px 20px ${getColorHex(variant.color)}40` : 'none'
                            }}
                          />
                        </div>
                        <span className={`text-[9px] tracking-luxury uppercase transition-all duration-500 ${isActive ? "text-black font-bold" : "text-black/30 font-medium group-hover:text-black/60"}`}>
                          {variant.color}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-10 pt-4">
              <div className="flex items-center space-x-8">
                <p className="text-[10px] tracking-luxury-lg uppercase text-black/40 font-medium">Quantité</p>
                <div className="flex items-center border border-black/5 h-14 bg-luxury-gray/30 px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 hover:bg-white hover:shadow-soft transition-all duration-500"
                  >
                    <Minus className="h-3 w-3 stroke-[1.5]" />
                  </Button>
                  <span className="px-8 text-[11px] font-medium tracking-luxury">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 hover:bg-white hover:shadow-soft transition-all duration-500"
                  >
                    <Plus className="h-3 w-3 stroke-[1.5]" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="w-full h-14 border-black text-black hover:bg-black hover:text-white transition-all uppercase tracking-widest text-xs"
                  disabled={!product.inStock}
                >
                  <span>Acheter maintenant</span>
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="luxury"
                  className="w-full h-14 bg-black text-white hover:bg-black/90 uppercase tracking-widest text-xs"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-4 stroke-[1.5]" />
                  Ajouter au panier
                </Button>
              </div>
            </div>

            <div className="w-16 h-[1px] bg-black/10" />

            {/* Description */}
            <p className="text-black/60 leading-relaxed-extra text-lg font-light max-w-xl">
              {product.description}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-12 border-t border-black/[0.03] pt-12">
              {product.material && (
                <div className="space-y-2">
                  <p className="text-[10px] tracking-luxury-lg uppercase text-black/30">Matériau</p>
                  <p className="text-sm text-black font-light tracking-luxury">{product.material}</p>
                </div>
              )}
              {product.gemstone && (
                <div className="space-y-2">
                  <p className="text-[10px] tracking-luxury-lg uppercase text-black/30">Pierre</p>
                  <p className="text-sm text-black font-light tracking-luxury">{product.gemstone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-20 flex items-center justify-end border-t border-black/[0.03] pt-10">
            <button
              onClick={handleShare}
              className="flex items-center text-[10px] tracking-luxury uppercase text-black/30 hover:text-black transition-all duration-700 group"
            >
              <Share2 className="h-3.5 w-3.5 mr-3 stroke-[1.5]" /> Partager
            </button>
          </div>
        </motion.div>
      </div >
    </div >
  )
}

