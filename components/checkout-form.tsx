"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  const { items, clearCart } = useCart()
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [cityDialogOpen, setCityDialogOpen] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Prepare order details from cart items
    const orderDetails = items
      .map((item) => `${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})`)
      .join(" + ")

    const formDataToSend = {
      name: formData.fullName,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      orderDetails,
      total: formatPrice(total),
      delivery: formatPrice(delivery),
    }

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbzk2B2OigYnpg9LMGwEWBkUTjEe0NiOP_lv9Bro7-dMuclCe-dX1IN12wBVUiFecuZ2LA/exec",
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

const total = subtotal + delivery


  // Prevent checkout with empty cart or zero total
  if (items.length === 0 || total <= 0) {
    return (
      <section className="max-w-2xl mx-auto">
        <Card className="border-0 luxury-card premium-shadow bg-white">
          <CardContent className="p-12 text-center">
            <figure className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-red-600" aria-hidden="true" />
            </figure>
            <h2 className="text-3xl font-serif font-medium mb-4 text-black">Panier vide ou invalide</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Votre panier est vide ou le montant total est invalide. Veuillez ajouter des articles avant de passer commande.
            </p>
            <a href="/products">
              <Button className="w-full premium-button text-white px-8 py-3 text-sm tracking-[0.1em] rounded-none uppercase">
                VOIR LES PRODUITS
              </Button>
            </a>
          </CardContent>
        </Card>
      </section>
    )
  }

  // Show success message instead of form
  if (orderSuccess) {
    return (
      <section className="max-w-2xl mx-auto">
        <Card className="border-0 luxury-card premium-shadow bg-white">
          <CardContent className="p-12 text-center">
            <figure className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" aria-hidden="true" />
            </figure>
            <h2 className="text-3xl font-serif font-medium mb-4 text-black">Merci pour votre commande !</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Votre commande a été reçue avec succès. Nous vous contacterons bientôt pour confirmer les détails de
              livraison.
            </p>
            <section className="space-y-4">
              <a href="/products">
                <Button className="w-full premium-button text-white px-8 py-3 text-sm tracking-[0.1em] rounded-none uppercase">
                  CONTINUER VOS ACHATS
                </Button>
              </a>
              <a href="/">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 rounded-none py-3 text-sm tracking-wider"
                >
                  RETOUR À L'ACCUEIL
                </Button>
              </a>
            </section>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="max-w-2xl mx-auto">
      <Card className="border-0 luxury-card premium-shadow bg-white">
        <CardHeader className="pb-6 border-b border-gray-100">
          <CardTitle className="text-2xl font-medium text-black">Insérer vos coordonnées</CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <fieldset className="space-y-6">
              <section className="flex items-center space-x-4">
                <figure className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" aria-hidden="true" />
                </figure>
                <Input
                  name="fullName"
                  type="text"
                  placeholder="Nom & Prénom"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  maxLength={23}
                  required
                  disabled={isSubmitting}
                  className="flex-1 h-12 border-gray-200 rounded-lg focus:border-black focus:ring-black text-gray-700 placeholder-gray-500"
                />
              </section>

              <section className="flex items-center space-x-4">
                <figure className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-gray-600" aria-hidden="true" />
                </figure>
                <Input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  pattern="[0-9]{1,10}" maxLength={10}
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="flex-1 h-12 border-gray-200 rounded-lg focus:border-black focus:ring-black text-gray-700 placeholder-gray-500"
                />
              </section>

              <section className="flex items-center space-x-4">
                <figure className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-gray-600" aria-hidden="true" />
                </figure>
                <button
                  type="button"
                  onClick={() => setCityDialogOpen(true)}
                  className="flex h-12 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <span className="line-clamp-1 text-left">
                    {formData.city ? formData.city.charAt(0).toUpperCase() + formData.city.slice(1) : "Sélectionnez votre ville"}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-search h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>

                <CommandDialog open={cityDialogOpen} onOpenChange={setCityDialogOpen}>
                  <CommandInput placeholder="Rechercher une ville..." />
                  <CommandList>
                    <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                    {Object.keys(shippingRates).map((city) => (
                      <CommandItem
                        key={city}
                        value={city}
                        onSelect={(value) => {
                          setFormData((prev) => ({ ...prev, city: value }))
                          setCityDialogOpen(false)
                        }}
                      >
                        {city.charAt(0).toUpperCase() + city.slice(1)}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandDialog>
              </section>

              <section className="flex items-center space-x-4">
                <figure className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Map className="h-6 w-6 text-gray-600" aria-hidden="true" />
                </figure>
                <Input
                  name="address"
                  type="text"
                  placeholder="Adresse"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="flex-1 h-12 border-gray-200 rounded-lg focus:border-black focus:ring-black text-gray-700 placeholder-gray-500"
                />
              </section>
            </fieldset>

            {/* Order Summary */}
            <aside className="space-y-4 pt-6 border-t border-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-black text-sm">{item.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-black">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </aside>

            {/* Pricing Summary */}
            <section className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-gray-700">
                <span>Sous-total</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Livraison</span>
                <span className="font-medium">{formatPrice(delivery)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-black pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </section>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !formData.city}
              className="w-full premium-button text-white h-16 text-lg font-medium tracking-[0.1em] rounded-none mt-8 uppercase"
            >
              {isSubmitting ? "Envoi en cours..." : "Acheter Maintenant"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
