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
      setFormData({ fullName: "", phone: "", address: "", city: "" })
    } catch (error) {
      console.error("Error details:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderSuccess) {
    return (
      <Card className="w-full max-w-lg mx-auto bg-white border-0 shadow-luxury overflow-hidden mt-12">
        <CardContent className="p-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "custom" }}
            className="relative w-24 h-24 mb-8 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse opacity-50" />
            <div className="relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center shadow-sm border border-green-100">
              <CheckCircle className="h-10 w-10 text-green-600 stroke-[1.5]" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-serif font-medium text-black tracking-luxury uppercase mb-6">Commande Validée</h2>
          <p className="text-gray-500 font-light leading-relaxed mb-10 text-lg">
            Merci pour votre commande ! Notre équipe vous contactera bientôt.
            <br />
            شكرًا لطلبك! سنتواصل معك قريبًا لتأكيد التفاصيل.
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full bg-black text-white px-12 py-7 text-[10px] tracking-[0.3em] rounded-none uppercase transition-all duration-500 hover:bg-gray-900"
          >
            Retour à l'accueil
          </Button>
        </CardContent>
      </Card>
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