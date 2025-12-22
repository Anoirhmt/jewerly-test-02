"use client"

 import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/utils/format-price"
 

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
      // Allow only digits
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
    // Validation simple
    if (!formData.fullName || formData.phone.length !== 10 || !formData.address || !formData.city) {
      setFormError(true)
      return
    }

    setIsSubmitting(true)
    setFormError(false)

    // Build order details for the single special pack product
    const orderDetails = `${product?.name ?? "Pack Spécial"} x1 (${formatPrice(product?.price ?? 0)})`
    const formDataToSend = {
      name: formData.fullName,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      orderDetails,
      total: formatPrice(product?.price ?? 0),
      delivery: formatPrice(0),
      promoCode: null,
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

      setOrderSuccess(true)

      // Reset form
      setFormData({ fullName: "", phone: "", address: "", city: "" })
    } catch (error) {
      console.error("Error details:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto luxury-card premium-shadow bg-white">
        <CardHeader>
          <CardTitle className="text-center text-green-600">Commande réussie!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <span className="text-6xl mb-4">✅</span>
          <p className="text-center mb-4">
            شكرًا لطلبك! سنتواصل معك قريبًا لتأكيد التفاصيل.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8 border-0 luxury-card premium-shadow bg-white">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-black font-sans">اطلب هذا الباك مباشرة</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center border rounded-md p-3 bg-gray-50 focus-within:ring-2 focus-within:ring-black transition">
              <span aria-hidden="true" className="mr-3 text-xl">👤</span>
              <Input
                name="fullName"
                placeholder="الاسم الكامل"
                value={formData.fullName}
                onChange={handleInputChange}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex items-center border rounded-md p-3 bg-gray-50 focus-within:ring-2 focus-within:ring-black transition">
              <span aria-hidden="true" className="mr-3 text-xl">📞</span>
              <Input
                name="phone"
                placeholder="رقم الهاتف"
                value={formData.phone}
                onChange={handleInputChange}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex items-center border rounded-md p-3 bg-gray-50 focus-within:ring-2 focus-within:ring-black transition">
              <span aria-hidden="true" className="mr-3 text-xl">📍</span>
              <Input
                name="city"
                placeholder="المدينة"
                value={formData.city}
                onChange={handleInputChange}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex items-center border rounded-md p-3 bg-gray-50 focus-within:ring-2 focus-within:ring-black transition">
              <span aria-hidden="true" className="mr-3 text-xl">🏠</span>
              <Input
                name="address"
                placeholder="العنوان"
                value={formData.address}
                onChange={handleInputChange}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {formError && (
            <p className="text-red-500 text-sm">يرجى ملء جميع الحقول.</p>
          )}



          <Button 
            type="submit" 
            className="w-full premium-button text-white px-8 py-3 text-sm tracking-[0.1em] rounded-none uppercase"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري المعالجة..." : "اطلب الآن"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}