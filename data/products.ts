export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  hoverImage?: string
  category: string
  material?: string
  gemstone?: string
  rating: number
  reviews: number
  inStock: boolean
  isPack?: boolean
  packContents?: string[]
}

export const products: Product[] = []
