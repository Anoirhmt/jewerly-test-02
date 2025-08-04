import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gem, Heart, Star, Crown } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/utils/format-price"

export function FeaturedCategories() {
  const categories = [
    {
      name: "Luxury Bracelets",
      description: "Elegant bracelets inspired by prestigious jewelry houses",
      icon: Crown,
      href: "/products",
      color: "bg-black",
    },
    {
      name: "Diamond Collection",
      description: "Sparkling pieces with premium crystal accents",
      icon: Gem,
      href: "/products",
      color: "bg-gray-800",
    },
    {
      name: "Jewelry Packs",
      description: "Curated sets for the perfect layered look",
      icon: Heart,
      href: "/packs",
      color: "bg-gray-700",
    },
    {
      name: "Premium Selection",
      description: "Our most exclusive and sought-after pieces",
      icon: Star,
      href: "/products",
      color: "bg-gray-900",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-light mb-6 text-black">Explore Our Collections</h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Discover carefully curated jewelry collections that embody elegance and sophistication
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.name}
                className="group hover:premium-shadow transition-all duration-500 border-0 bg-white"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${category.color} text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-serif font-medium mb-3 text-black">{category.name}</h3>
                  <p className="text-gray-600 font-light mb-6 leading-relaxed">{category.description}</p>
                  <Link href={category.href}>
                    <Button
                      variant="outline"
                      className="border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all duration-300 rounded-none bg-transparent"
                    >
                      Explore Collection
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function CheckoutSummary() {
  const { items } = useCart()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <Card>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-12 h-12 object-cover rounded" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
        </div>

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {subtotal < 50 && (
          <p className="text-sm text-gray-600">Add {formatPrice(50 - subtotal)} more for free shipping!</p>
        )}
      </CardContent>
    </Card>
  )
}
