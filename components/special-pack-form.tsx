"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/utils/format-price"
import { CheckCircle } from "lucide-react"

interface SpecialPackFormProps {
  product: any
}

export function SpecialPackForm({ product }: SpecialPackFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [formError, setFormError] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [orderNumber, setOrderNumber] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === "phone") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || formData.phone.length !== 10 || !formData.address || !formData.city) {
      setFormError(true)
      return
    }

    setIsSubmitting(true)
    setFormError(false)

    const orderDetails = `${product?.name ?? "Pack Spécial"} x1 (${formatPrice(product?.price ?? 0)})`
    const params = new URLSearchParams()
    params.append("nom et prenom", formData.fullName)
    params.append("Téléphone", formData.phone)
    params.append("Adresse", `${formData.address}, ${formData.city}`)
    params.append("Détails de commande", orderDetails)
    params.append("TOTAL", formatPrice(product?.price ?? 0))
    params.append("delivery", formatPrice(0))

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

      setOrderSuccess(true)
      const orderNum = `EL${Math.floor(100000 + Math.random() * 900000)}`
      setOrderNumber(orderNum)
      setCustomerName(formData.fullName)
      setFormData({ fullName: "", phone: "", address: "", city: "" })
    } catch (error) {
      console.error("Error details:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderSuccess) {
    return (
      <section className="w-full min-h-screen flex flex-col items-center justify-start pt-0 pb-20 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-4xl w-full text-center"
        >
          {/* Elarain Floral Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2, 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1],
              scale: { type: "spring", damping: 15, stiffness: 100 }
            }}
            className="mb-0 -mt-6 sm:-mt-10"
          >
            <div className="relative w-full h-[280px] sm:h-[480px] mx-auto">
              <img
                src="/Gemini_Generated_Image_5r67l45r67l45r67.png"
                alt="Elarain Floral Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#c5a367] tracking-wider uppercase">
              Merci pour votre commande{customerName ? `, ${customerName}` : ""}!
            </h1>
            <p className="text-[11px] text-[#c5a367] tracking-widest uppercase mt-4">
              Notre équipe vous contactera bientôt.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 space-y-6"
          >
            <button
              onClick={() => window.location.href = '/'}
              className="inline-block bg-[#c5a367] text-white px-12 py-4 text-[11px] tracking-[0.2em] uppercase rounded-full hover:bg-[#b49256] transition-all duration-300 shadow-lg font-medium"
            >
              Retour à l&apos;accueil
            </button>
          </motion.div>
        </motion.div>
      </section>
    )
  }

  return (
    <Card className="w-full max-w-xl mx-auto mt-24 border-0 bg-white shadow-luxury overflow-hidden rounded-none">
      <CardHeader className="p-10 pb-8 border-b border-gray-50 text-center">
        <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-4 block">Achat Rapide</span>
        <CardTitle className="text-2xl font-serif font-medium text-black tracking-luxury uppercase">Commander ce Pack</CardTitle>
      </CardHeader>
      <CardContent className="p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-medium ml-1">Nom Complet</label>
              <div className="relative group">
                <Input
                  name="fullName"
                  placeholder="NOM & PRÉNOM"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="h-14 pl-4 border-gray-100 bg-gray-50/30 rounded-none focus:bg-white focus:border-black focus:ring-0 text-sm tracking-wider placeholder:text-gray-300 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-medium ml-1">Téléphone</label>
              <div className="relative group">
                <Input
                  name="phone"
                  placeholder="06XXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="h-14 pl-4 border-gray-100 bg-gray-50/30 rounded-none focus:bg-white focus:border-black focus:ring-0 text-sm tracking-wider placeholder:text-gray-300 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-medium ml-1">Ville</label>
              <div className="relative group">
                <Input
                  name="city"
                  placeholder="VOTRE VILLE"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="h-14 pl-4 border-gray-100 bg-gray-50/30 rounded-none focus:bg-white focus:border-black focus:ring-0 text-sm tracking-wider placeholder:text-gray-300 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-medium ml-1">Adresse</label>
              <div className="relative group">
                <Input
                  name="address"
                  placeholder="VOTRE ADRESSE"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="h-14 pl-4 border-gray-100 bg-gray-50/30 rounded-none focus:bg-white focus:border-black focus:ring-0 text-sm tracking-wider placeholder:text-gray-300 transition-all"
                />
              </div>
            </div>
          </div>

          {formError && (
            <p className="text-[10px] text-red-500 tracking-widest uppercase text-center font-medium">
              Veuillez remplir tous les champs correctement.
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 md:py-8 text-[8px] md:text-[11px] tracking-[0.4em] rounded-none uppercase transition-all duration-500 hover:bg-gray-900 shadow-luxury group relative overflow-hidden"
          >
            <span className="relative z-10">{isSubmitting ? "TRAITEMENT..." : "COMMANDER MAINTENANT"}</span>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>

          <p className="text-[9px] text-gray-400 text-center tracking-[0.2em] uppercase font-light">
            Livraison 0 DH partout. Paiement à la livraison.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}