"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Star, Minus, Plus } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/utils/format-price"
import type { Product } from "@/data/products"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name}(s) added to your cart.`,
    })
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const images = [product.image, product.image, product.image, product.image] // Mock multiple images

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-none border border-gray-200">
          <img
            src={images[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover filter grayscale"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square overflow-hidden border ${
                selectedImage === index ? "border-black" : "border-gray-200"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover filter grayscale"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-medium mb-3 text-black">{product.name}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-black fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-gray-600">({product.reviews} reviews)</span>
            <Badge variant={product.inStock ? "default" : "destructive"} className="bg-black text-white border-0">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-4xl font-serif font-medium text-black">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="text-2xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
              <Badge className="bg-black text-white border-0">Save {discountPercentage}%</Badge>
            </>
          )}
        </div>

        {product.material && (
          <div className="space-y-1">
            <p className="text-gray-700 font-medium">Material</p>
            <p className="text-gray-600">{product.material}</p>
          </div>
        )}

        {product.gemstone && (
          <div className="space-y-1">
            <p className="text-gray-700 font-medium">Gemstone</p>
            <p className="text-gray-600">{product.gemstone}</p>
          </div>
        )}

        <p className="text-gray-600 leading-relaxed">{product.description}</p>

        {/* Quantity Selector */}
        <div className="flex items-center space-x-4">
          <span className="font-medium">Quantity:</span>
          <div className="flex items-center border border-gray-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="rounded-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-6 py-2 font-medium">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} className="rounded-none">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-black hover:bg-gray-900 text-white rounded-none"
            size="lg"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none">
            <TabsTrigger value="description" className="rounded-none">
              Description
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card className="border border-gray-200 rounded-none">
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  {product.description} This exquisite piece exemplifies our commitment to exceptional craftsmanship and
                  timeless design. Each element is carefully selected and meticulously crafted by our master jewelers to
                  ensure the highest quality and lasting beauty.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card className="border border-gray-200 rounded-none">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Customer Reviews</h3>
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-none bg-transparent">
                      Write a Review
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b pb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-black fill-current" />
                            ))}
                          </div>
                          <span className="font-medium">Sarah J.</span>
                          <span className="text-gray-500 text-sm">2 weeks ago</span>
                        </div>
                        <p className="text-gray-700">
                          Absolutely stunning piece! The craftsmanship is exceptional and it looks even more beautiful
                          in person. The packaging was elegant and delivery was prompt. Highly recommend!
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
