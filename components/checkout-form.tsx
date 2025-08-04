"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Phone, MapPin, CheckCircle } from "lucide-react"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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
    }

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbxPJ0LhNsRfBeRKYBFljVGidYMz9MQsgPcscdC4yT7W-0dtRC07QJD6wR9e7-dI-JDr/exec",
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

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = 0 // Free delivery
  const total = subtotal + delivery

  // Show success message instead of form
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 luxury-card premium-shadow bg-white">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-serif font-medium mb-4 text-black">Merci pour votre commande !</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Votre commande a été reçue avec succès. Nous vous contacterons bientôt pour confirmer les détails de
              livraison.
            </p>
            <Button
              onClick={() => setOrderSuccess(false)}
              className="premium-button text-white px-8 py-3 text-sm tracking-[0.1em] rounded-none uppercase"
            >
              Nouvelle Commande
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 luxury-card premium-shadow bg-white">
        <CardHeader className="pb-6 border-b border-gray-100">
          <CardTitle className="text-2xl font-medium text-black">Insérer vos coordonnées</CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <Input
                  name="fullName"
                  type="text"
                  placeholder="Nom & Prénom"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="flex-1 h-12 border-gray-200 rounded-lg focus:border-black focus:ring-black text-gray-700 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-gray-600" />
                </div>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="flex-1 h-12 border-gray-200 rounded-lg focus:border-black focus:ring-black text-gray-700 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-gray-600" />
                </div>
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
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-gray-600" />
                </div>
                <Input
                  name="city"
                  type="text"
                  placeholder="Ville"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="flex-1 h-12 border-gray-200 rounded-lg focus:border-black focus:ring-black text-gray-700 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
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
            </div>

            {/* Pricing Summary */}
            <div className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-gray-700">
                <span>Sous-total</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Livraison</span>
                <span className="font-medium">Gratuit</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-black pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full premium-button text-white h-16 text-lg font-medium tracking-[0.1em] rounded-none mt-8 uppercase"
            >
              {isSubmitting ? "Envoi en cours..." : "Acheter Maintenant"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
