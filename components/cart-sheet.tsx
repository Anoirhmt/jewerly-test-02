"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/utils/format-price"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, Trash2, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CartSheet() {
  const { items, isCartOpen, setCartOpen, removeItem, updateQuantity } = useCart()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="w-full sm:max-w-[500px] p-0 border-none bg-white flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.4em] uppercase text-black/30 font-medium">Selection</p>
            <h2 className="text-3xl font-serif italic text-black tracking-tight">The Private Archive</h2>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center space-y-4"
              >
                <p className="text-[10px] tracking-luxury uppercase text-black/30">Votre archive est vide</p>
                <Button
                  variant="ghost"
                  onClick={() => setCartOpen(false)}
                  className="text-[10px] tracking-luxury uppercase border-b border-black/10 rounded-none h-auto py-1 px-0"
                >
                  Continuer vos achats
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-10">
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.selectedColor || 'default'}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-6"
                  >
                    {/* Item Image */}
                    <div className="relative w-24 h-32 bg-luxury-cream overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        className="object-cover select-none"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-serif italic text-black leading-tight">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[9px] tracking-widest uppercase text-[#9b5c5c]/80 hover:text-[#9b5c5c] transition-colors"
                          >
                            Release
                          </button>
                        </div>
                        {item.selectedColor && (
                          <p className="text-[9px] tracking-luxury uppercase text-black/30">
                            {item.selectedColor}
                          </p>
                        )}
                        <p className="text-sm font-medium tracking-tight mt-2 text-[#9b5c5c]">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-black/5 rounded-none">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-[10px] w-6 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 pt-6 border-t border-black/[0.03] space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-[10px] tracking-[0.4em] uppercase text-black/30 font-medium">Total Valuation</span>
              <span className="text-3xl font-serif italic text-[#9b5c5c] tracking-tight">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="flex gap-2">
              <Link href="/checkout" className="flex-1" onClick={() => setCartOpen(false)}>
                <Button className="w-full bg-black text-white h-16 rounded-none text-[11px] tracking-[0.4em] uppercase hover:bg-black/90 transition-all">
                  Bespoke Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
