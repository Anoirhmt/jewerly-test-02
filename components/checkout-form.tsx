"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Phone, MapPin, Map, CheckCircle } from "lucide-react"
import { CommandDialog, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/utils/format-price"

export function CheckoutForm() {
  const { items, clearCart, totalItems, totalPrice } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [flatDiscount, setFlatDiscount] = useState(0)
  const [freeShipping, setFreeShipping] = useState(false)
  const [promoCodeFeedback, setPromoCodeFeedback] = useState<{ message: string; type: "success" | "error" } | null>(
    null,
  )
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [cityDialogOpen, setCityDialogOpen] = useState(false)
  const [formError, setFormError] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === "phone") {
      // Allow only digits and '+'
      value = value.replace(/\D/g, "");
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const applyPromoCode = async () => {
    const code = promoCode.trim().toUpperCase()
    if (!code) return

    // Reset previous states
    setPromoCodeFeedback(null)
    setDiscount(0)
    setFlatDiscount(0)
    setFreeShipping(false)

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          phone: formData.phone,
          subtotal,
          city: formData.city,
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        }),
      })

      const data = await res.json()
      if (data.valid) {
        if (data.discountType === "percent") {
          setDiscount(Number(data.value) || 0)
        } else if (data.discountType === "fixed") {
          setFlatDiscount(Number(data.value) || 0)
        } else if (data.discountType === "free_shipping") {
          setFreeShipping(true)
        }
        setPromoCodeFeedback({ message: data.message || "Code promo appliqué !", type: "success" })
      } else {
        setPromoCodeFeedback({
          message: data.reason === "MAX_USES_REACHED" ? "Limite d'utilisation atteinte" :
                   data.reason === "PER_USER_LIMIT_REACHED" ? "Vous avez déjà utilisé ce code" :
                   data.reason === "MIN_SUBTOTAL_NOT_MET" ? `Montant minimum non atteint` :
                   data.reason === "EXPIRED" ? "Code expiré" :
                   data.reason === "NOT_STARTED" ? "Code non encore actif" :
                   data.reason === "CITY_NOT_ELIGIBLE" ? "Ville non éligible" :
                   "Code promo invalide",
          type: "error",
        })
      }
    } catch (e) {
      console.error(e)
      setPromoCodeFeedback({ message: "Erreur lors de la vérification du code", type: "error" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side guard to validate required fields before continuing.
    const firstMissingField = !formData.fullName.trim()
      ? "fullName"
      : formData.phone.length !== 10
      ? "phone"
      : !formData.address.trim()
      ? "address"
      : !formData.city
      ? "city"
      : null

    if (firstMissingField) {
      // Show visual feedback and scroll to the missing field
      setPromoCodeFeedback({
        message: "Veuillez remplir toutes les informations requises avant de continuer",
        type: "error",
      })
      setFormError(true)
      // Attempt to focus & scroll the missing element into view
      const el = document.getElementsByName(firstMissingField)[0] as HTMLElement | undefined
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        el.focus()
      }
      // Reset the red state after a short delay so the button can turn back to black
      setTimeout(() => setFormError(false), 3000)
      return
    }
    setIsSubmitting(true)

    // Prepare order details from cart items
    const orderDetails = items
      .map((item) => `${item.name}${(item as any).selectedColor ? ` [${(item as any).selectedColor}]` : ''} x${item.quantity} (${formatPrice(item.price * item.quantity)})`)
      .join(" + ")

    const formDataToSend = {
      name: formData.fullName,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      orderDetails,
      total: formatPrice(total),
      delivery: formatPrice(effectiveDelivery),
      promoCode: promoCode.trim().toUpperCase() || null,
    }

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycby8cjoqZpv9aOP71a2HfN3-wPWboHf_uTJD7u0hfaKI7E-0kJcFV_HMu6iqU9-6YXfctg/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(formDataToSend),
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      // Show success state instead of alert
      setOrderSuccess(true)
      // Increment promo usage only now (after successful order)
      if (promoCode.trim()) {
        fetch("/api/promo/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: promoCode.trim().toUpperCase(), phone: formData.phone }),
        }).catch(console.error);
      }

      clearCart()

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        city: "",
      })
    } catch (error) {
      console.error("Error details:", error)
      // You can choose to show nothing here too, or just log the error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate subtotal
const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

// Shipping rates and delivery fee
const [shippingRates, setShippingRates] = useState<Record<string, number>>({})
const [delivery, setDelivery] = useState<number>(0)

// Load shipping rates once
useEffect(() => {
  fetch("/shipping-rates.txt")
    .then((res) => res.text())
    .then((text) => {
      const rates: Record<string, number> = {}
      text.split(/\r?\n/).forEach((line) => {
        const parts = line.trim().split(/\s+/)
        if (parts.length >= 2) {
          const price = parseInt(parts[parts.length - 2])
          const city = parts.slice(0, parts.length - 2).join(" ")
          if (!isNaN(price)) {
            rates[city.toLowerCase()] = price
          }
        }
      })
      setShippingRates(rates)
    })
    .catch(console.error)
}, [])

// Update delivery when city changes
useEffect(() => {
  if (formData.city) {
    const fee = shippingRates[formData.city.toLowerCase()] || 0
    setDelivery(fee)
  }
}, [formData.city, shippingRates])

const effectiveDelivery = freeShipping ? 0 : delivery
const percentOff = subtotal * discount
const fixedOff = flatDiscount
const total = Math.max(0, subtotal + effectiveDelivery - percentOff - fixedOff)


  // Prevent checkout with empty cart or zero total
  if (items.length === 0 || total <= 0) {
    return (
      <section className="max-w-2xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-0 bg-white shadow-luxury overflow-hidden">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle className="h-10 w-10 text-black" />
              </motion.div>
              <h2 className="text-3xl font-serif font-medium mb-4 text-black tracking-luxury">COMMANDE VALIDÉE</h2>
              <p className="text-gray-500 mb-10 text-lg font-light">
                Votre commande a été validée avec succès. Merci pour votre confiance.
              </p>
              <Link href="/products" className="block">
                <Button className="w-full bg-black text-white px-8 py-4 text-[10px] tracking-[0.3em] rounded-none uppercase transition-all duration-500 hover:bg-gray-900">
                  VOIR LES PRODUITS
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    )
  }

  // Show success message instead of form
  if (orderSuccess) {
    return (
      <section className="max-w-2xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <Card className="border-0 bg-white shadow-luxury overflow-hidden">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-10"
              >
                <CheckCircle className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-4xl font-serif font-medium mb-6 text-black tracking-luxury uppercase">Merci</h2>
              <p className="text-gray-500 mb-12 text-lg font-light leading-relaxed">
                Votre commande a été reçue. Notre équipe vous contactera sous peu pour la confirmation finale.
              </p>
              <div className="space-y-4">
                <Link href="/products" className="block">
                  <Button className="w-full bg-black text-white px-8 py-4 text-[10px] tracking-[0.3em] rounded-none uppercase transition-all duration-500 hover:bg-gray-900">
                    CONTINUER VOS ACHATS
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-[10px] tracking-[0.3em] uppercase hover:bg-gray-50 rounded-none py-4 transition-colors"
                  >
                    RETOUR À L'ACCUEIL
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Card className="border-0 bg-white shadow-luxury overflow-hidden">
          <CardHeader className="pb-8 border-b border-gray-50 px-10 pt-10">
            <CardTitle className="text-3xl font-serif font-medium text-black tracking-luxury uppercase">
              Finaliser la commande
            </CardTitle>
            <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase mt-2">Paiement à la livraison</p>
          </CardHeader>

          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div 
                    className="group relative"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <Input
                      name="fullName"
                      type="text"
                      placeholder="NOM & PRÉNOM | الاسم الكامل"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      maxLength={23}
                      required
                      disabled={isSubmitting}
                      className="h-14 pl-12 border-gray-100 bg-gray-50/30 rounded-none focus:bg-white focus:border-black focus:ring-0 text-sm tracking-wider placeholder:text-gray-300 transition-all"
                    />
                  </motion.div>

                  <motion.div 
                    className="group relative"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                      <Phone className="h-5 w-5" />
                    </div>
                    <Input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      pattern="[0-9]{10}" minLength={10} maxLength={10}
                      placeholder="TÉLÉPHONE | الهاتف"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="h-14 pl-12 border-gray-100 bg-gray-50/30 rounded-none focus:bg-white focus:border-black focus:ring-0 text-sm tracking-wider placeholder:text-gray-300 transition-all"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setCityDialogOpen(true)}
                      className={`group relative flex h-14 w-full items-center justify-between px-4 text-sm transition-all duration-300 ${
                        formData.city 
                          ? 'border border-gray-100 bg-gray-50/30 text-black hover:border-black' 
                          : 'border-2 border-dashed border-gray-200 text-gray-400 hover:border-black'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <MapPin className={`h-5 w-5 ${formData.city ? 'text-black' : 'text-gray-300'}`} />
                        <span className="tracking-wider uppercase text-xs">
                          {formData.city ? formData.city : "SÉLECTIONNEZ VOTRE VILLE"}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-black transition-colors" />
                    </button>
                    {!formData.city && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-gray-400 tracking-widest uppercase ml-1"
                      >
                        * Requis pour la livraison
                      </motion.p>
                    )}
                  </div>

                  <motion.div 
                    className="group relative"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                      <Map className="h-5 w-5" />
                    </div>
                    <Input
                      name="address"
                      type="text"
                      placeholder="ADRESSE | العنوان"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="h-14 pl-12 border-gray-100 bg-gray-50/30 rounded-none focus:bg-white focus:border-black focus:ring-0 text-sm tracking-wider placeholder:text-gray-300 transition-all"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6 pt-10 border-t border-gray-50">
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium mb-6">Votre Sélection</h3>
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center space-x-6 bg-gray-50/50 p-4"
                      >
                        <div className="relative h-20 w-16 overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[9px] flex items-center justify-center font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs tracking-widest uppercase text-black font-medium truncate">{item.name}</h4>
                          {(item as any).selectedColor && (
                            <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-1">
                              Couleur: {(item as any).selectedColor}
                            </p>
                          )}
                        </div>
                        <div className="text-xs tracking-widest text-black font-light">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Promo & Totals */}
              <div className="pt-10 border-t border-gray-50 space-y-8">
                <div className="flex space-x-4">
                  <Input
                    type="text"
                    placeholder="CODE PROMO"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-12 border-gray-100 bg-gray-50/30 rounded-none focus:bg-white focus:border-black focus:ring-0 text-[10px] tracking-[0.3em] uppercase placeholder:text-gray-300 transition-all flex-1"
                  />
                  <Button
                    type="button"
                    onClick={applyPromoCode}
                    className="bg-black text-white px-8 py-3 text-[10px] tracking-[0.2em] rounded-none uppercase transition-all duration-500 hover:bg-gray-800"
                  >
                    Appliquer
                  </Button>
                </div>
                {promoCodeFeedback && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[10px] tracking-[0.1em] uppercase ${promoCodeFeedback.type === "success" ? "text-green-600" : "text-red-500"}`}
                  >
                    {promoCodeFeedback.message}
                  </motion.p>
                )}

                <div className="space-y-4 pt-4">
                  <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-gray-500">
                    <span>Sous-total</span>
                    <span className="font-medium text-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-gray-500">
                    <span>Frais de livraison</span>
                    <span className="font-medium text-black">
                      {effectiveDelivery === 0 ? "GRATUIT" : formatPrice(effectiveDelivery)}
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-6 border-t border-gray-50">
                    <span className="text-xs tracking-[0.4em] uppercase text-black font-medium">Total</span>
                    <span className="text-2xl font-light text-black tracking-widest">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group relative w-full h-16 text-[10px] tracking-[0.4em] rounded-none uppercase transition-all duration-700 overflow-hidden ${
                    formError ? 'bg-red-500' : 'bg-black hover:bg-gray-900'
                  } text-white`}
                >
                  <span className="relative z-10">
                    {isSubmitting ? "TRAITEMENT..." : "Confirmer la commande"}
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                </Button>
                <p className="text-center text-[9px] text-gray-400 tracking-[0.2em] uppercase mt-6">
                  Paiement sécurisé à la réception
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* City Dialog - Reuse CommandDialog from original code but style it */}
      <CommandDialog open={cityDialogOpen} onOpenChange={setCityDialogOpen}>
        <div className="p-4 border-b border-gray-50">
          <h3 className="text-[10px] tracking-[0.3em] uppercase text-black font-medium">Sélectionnez votre ville</h3>
        </div>
        <CommandInput placeholder="Rechercher..." className="border-none focus:ring-0 text-sm tracking-widest uppercase" />
        <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
          <CommandEmpty className="py-6 text-center text-[10px] tracking-[0.2em] uppercase text-gray-400">
            Aucune ville trouvée
          </CommandEmpty>
          {Object.keys(shippingRates).sort().map((city) => (
            <CommandItem
              key={city}
              value={city}
              onSelect={(value) => {
                setFormData((prev) => ({ ...prev, city: value.toUpperCase() }))
                setCityDialogOpen(false)
              }}
              className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase text-gray-600 group-hover:text-black">
                {city.toUpperCase()}
              </span>
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </section>
  )
}
