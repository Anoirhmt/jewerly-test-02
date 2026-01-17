"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Phone, MapPin, Map, CheckCircle, ChevronRight } from "lucide-react"
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

    const params = new URLSearchParams()
    params.append("nom et prenom", formData.fullName)
    params.append("Téléphone", formData.phone)
    params.append("Adresse", `${formData.address}, ${formData.city}`)
    params.append("Détails de commande", orderDetails)
    params.append("TOTAL", formatPrice(total))
    params.append("delivery", formatPrice(effectiveDelivery))
    if (promoCode.trim()) {
      params.append("promoCode", promoCode.trim().toUpperCase())
    }

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbyQagx3a8x5-vfVy1afXcWSa0gdTJupjvFoJ6Jn8k3qt1Hp-KRYC6eZTKbUPS-PmhsF/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
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
      setPromoCodeFeedback({
        message: "Une erreur est survenue lors de la validation. Veuillez réessayer.",
        type: "error",
      })
      setFormError(true)
      setTimeout(() => setFormError(false), 3000)
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
      <section className="w-full py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <Card className="border-0 bg-white shadow-luxury overflow-hidden max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "backOut" }}
                className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse opacity-50" />
                <div className="relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center shadow-sm border border-green-100">
                  <CheckCircle className="h-10 w-10 text-green-600 stroke-[1.5]" />
                </div>
              </motion.div>
              <h2 className="text-3xl font-serif font-medium mb-4 text-black tracking-luxury uppercase">Commande Validée</h2>
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
    <section className="w-full py-4 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="border-0 bg-white shadow-luxury overflow-hidden max-w-3xl mx-auto">
          <CardHeader className="pb-8 border-b border-black/[0.03] px-8 pt-10 text-center">
            <CardTitle className="text-2xl font-sans font-medium text-black tracking-tight">
              Insérer vos coordonnées
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5">
                  {/* Nom & Prénom */}
                  <div className="flex gap-4">
                    <div className="h-14 w-14 shrink-0 bg-gray-50 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400">
                      <User className="h-5 w-5 stroke-[1.5]" />
                    </div>
                    <Input
                      name="fullName"
                      type="text"
                      placeholder="Nom & Prénom | الاسم الكامل"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      maxLength={50}
                      required
                      disabled={isSubmitting}
                      className="h-14 flex-1 border-gray-200 bg-white rounded-xl focus:border-black focus:ring-black/5 text-sm placeholder:text-gray-400 transition-all shadow-sm"
                    />
                  </div>

                  {/* Téléphone */}
                  <div className="flex gap-4">
                    <div className="h-14 w-14 shrink-0 bg-gray-50 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400">
                      <Phone className="h-5 w-5 stroke-[1.5]" />
                    </div>
                    <Input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      pattern="[0-9]{10}" minLength={10} maxLength={10}
                      placeholder="Téléphone | الهاتف"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="h-14 flex-1 border-gray-200 bg-white rounded-xl focus:border-black focus:ring-black/5 text-sm placeholder:text-gray-400 transition-all shadow-sm"
                    />
                  </div>

                  {/* Ville */}
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div className="h-14 w-14 shrink-0 bg-gray-50 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400">
                        <MapPin className="h-5 w-5 stroke-[1.5]" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setCityDialogOpen(true)}
                        className={`h-14 flex-1 flex items-center px-4 border rounded-xl transition-all text-sm text-left relative group shadow-sm ${formData.city
                          ? "bg-white border-gray-200 text-black"
                          : "bg-white border-dashed border-blue-300 text-gray-400 hover:border-blue-400"
                          }`}
                      >
                        <span className="flex-1 truncate">
                          {formData.city ? formData.city : "Sélectionnez votre ville | اختر المدينة"}
                        </span>
                        {!formData.city && (
                          <span className="hidden sm:inline-block text-[10px] text-blue-400 ml-2 font-medium">
                            Cliquez pour sélectionner
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-300 ml-2" />
                      </button>
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="flex gap-4">
                    <div className="h-14 w-14 shrink-0 bg-gray-50 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400">
                      <Map className="h-5 w-5 stroke-[1.5]" />
                    </div>
                    <Input
                      name="address"
                      type="text"
                      placeholder="Adresse | العنوان"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="h-14 flex-1 border-gray-200 bg-white rounded-xl focus:border-black focus:ring-black/5 text-sm placeholder:text-gray-400 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6 pt-6 border-t border-black/[0.03]">
                <h3 className="text-[10px] tracking-luxury-lg uppercase text-black/40 font-medium text-center mb-8">Votre Sélection</h3>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.id}-${(item as any).selectedColor || 'default'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                        className="flex items-center space-x-6 bg-gray-50/30 p-4 border border-black/[0.02]"
                      >
                        <div className="relative h-24 w-20 overflow-hidden bg-white">
                          <Image
                            src={item.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNGOEY4RjgiLz48L3N2Zz4="}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                          />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-black text-white text-[10px] flex items-center justify-center font-bold z-10 shadow-lg">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] tracking-luxury uppercase text-black font-medium truncate">{item.name}</h4>
                          {(item as any).selectedColor && (
                            <p className="text-[9px] text-black/30 tracking-luxury uppercase mt-2 font-light">
                              Finition: {(item as any).selectedColor}
                            </p>
                          )}
                        </div>
                        <div className="text-[11px] tracking-luxury text-black font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Promo & Totals */}
              <div className="pt-6 border-t border-black/[0.03] space-y-8">
                <div className="flex space-x-4">
                  <Input
                    type="text"
                    placeholder="CODE PROMO"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-8 md:h-10 border-black/[0.06] bg-white rounded-none focus:bg-white focus:border-black/20 focus:ring-0 text-[8px] md:text-[9px] tracking-luxury-lg uppercase placeholder:text-black/20 transition-all flex-1 shadow-sm"
                  />
                  <Button
                    type="button"
                    onClick={applyPromoCode}
                    className="bg-black text-white px-3 md:px-6 h-8 md:h-10 text-[7px] md:text-[8px] tracking-luxury-lg uppercase rounded-none transition-all duration-700 hover:bg-gray-900 font-light"
                  >
                    Appliquer
                  </Button>
                </div>
                {promoCodeFeedback && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[10px] tracking-luxury-lg uppercase text-center ${promoCodeFeedback.type === "success" ? "text-green-600" : "text-red-500"}`}
                  >
                    {promoCodeFeedback.message}
                  </motion.p>
                )}

                <div className="space-y-5 px-2">
                  <div className="flex justify-between text-[10px] tracking-luxury-lg uppercase text-black/40">
                    <span>Sous-total</span>
                    <span className="font-medium text-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] tracking-luxury-lg uppercase text-black/40">
                    <span>Livraison</span>
                    <span className="font-medium text-black">
                      {effectiveDelivery === 0 ? formatPrice(0) : formatPrice(effectiveDelivery)}
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-8 border-t border-black/[0.03]">
                    <div className="flex flex-col">
                      <span className="text-[10px] tracking-luxury-lg uppercase text-black/40 mb-2">Total à payer</span>
                      <span className="text-xs tracking-luxury-xl uppercase text-black font-bold">TTC</span>
                    </div>
                    <span className="text-3xl font-light text-black tracking-luxury leading-none">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group relative w-full h-10 md:h-20 text-[8px] md:text-[11px] tracking-luxury-xl rounded-none uppercase transition-all duration-700 overflow-hidden ${formError ? 'bg-red-600' : 'bg-black hover:bg-gray-900'
                    } text-white shadow-xl`}
                >
                  <span className="relative z-10">
                    {isSubmitting ? "TRAITEMENT EN COURS..." : "Confirmer la commande"}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                </Button>
                <div className="flex flex-col items-center gap-4 mt-4">
                  <div className="h-[1px] w-12 bg-black/10" />
                  <p className="text-[9px] text-black/30 tracking-luxury-lg uppercase font-light">
                    Paiement sécurisé à la livraison
                  </p>
                </div>
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
              onSelect={() => {
                setFormData((prev) => ({ ...prev, city: city.toUpperCase() }))
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
