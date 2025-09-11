"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/utils/format-price"
import type { Product } from "@/data/products"

interface PackCardProps {
  product: Product
}

export function PackCard({ product }: PackCardProps) {
  const validSrc =
    product.image &&
    (product.image.startsWith("http://") ||
      product.image.startsWith("https://") ||
      product.image.startsWith("/"))
      ? product.image
      : "/placeholder.svg?height=320&width=320&text=Jewelry";
  return (
    <Card className="group transform-gpu transition-all duration-300 bg-white border border-gray-300 hover:border-gray-400 rounded-lg overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/products/${product.id}`} draggable={false} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} onCopy={(e) => e.preventDefault()}>
          <figure className="relative overflow-hidden rounded-t-lg select-none" draggable={false} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} onCopy={(e) => e.preventDefault()}>
            <Image
              src={validSrc}
              alt={product.name}
              width={320}
              height={320}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              className="w-full h-80 object-cover transition-transform duration-1000 pointer-events-none"
              loading="lazy"
            />
            <Badge className="absolute top-4 left-4 bg-black text-white border-0 px-3 py-1 text-xs tracking-wider">
              <Package className="h-3 w-3 mr-1" />
              PACK
            </Badge>
            
            <div className="pointer-events-none absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500"></div>
          </figure>
        </Link>

        <article className="p-6">
          <header>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-serif text-xl font-medium mb-2 hover:text-gray-700 transition-colors line-clamp-2 text-black">
                {product.name}
              </h3>
            </Link>
            {product.material && <p className="text-gray-500 text-sm mb-3 font-light">{product.material}</p>}
          </header>


          {/* Pack Contents */}
          {product.packContents && (
            <section className="mb-4 p-3 bg-gray-50 border border-gray-100 rounded-none">
              <h4 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">Pack Includes:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {product.packContents.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-black mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <footer className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold text-black">{formatPrice(product.price)}</span>
              <Badge className="bg-green-100 text-green-800 border-0 text-xs">SAVE 20%</Badge>
            </div>
          </footer>


        </article>
      </CardContent>
    </Card>
  )
}
