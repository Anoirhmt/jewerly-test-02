export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  material?: string
  gemstone?: string
  rating: number
  reviews: number
  inStock: boolean
  isPack?: boolean
  packContents?: string[]
}

export const products: Product[] = [
  {
    id: 101,
    name: "Luxury Gold Stack Pack",
    description:
      "Complete your luxury look with this exquisite 4-piece bracelet collection featuring iconic designs from the world's most prestigious jewelry houses.",
    price: 175,
    image: "/images/pack1.jpg",
    category: "Packs",
    material: "18K Gold Plated",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isPack: true,
    packContents: [
      "1x Rivière Diamond Tennis Bracelet",
      "1x Van Cleef & Arpels Style Gold Bracelet",
      "1x Cartier Love Style Gold Bracelet",
      "1x Juste un Clou Style Gold Bracelet",
    ],
  },
  {
    id: 102,
    name: "Elegant White & Gold Pack",
    description:
      "Sophisticated 3-piece bracelet set combining timeless white mother-of-pearl accents with lustrous gold finishes for the perfect elegant stack.",
    price: 99,
    image: "/images/pack2.jpg",
    category: "Packs",
    material: "18K Gold Plated, Mother of Pearl",
    rating: 4.8,
    reviews: 67,
    inStock: true,
    isPack: true,
    packContents: [
      "1x Van Cleef & Arpels Style White Mother-of-Pearl Bracelet",
      "1x Cartier Love Style Gold Bracelet",
      "1x Juste un Clou Style Gold Bracelet",
    ],
  },
]
