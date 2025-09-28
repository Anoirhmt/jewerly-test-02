import type { Product } from "./products";

export const collectionProducts: Product[] = [
  {
    id: 301,
    name: "Cartier Ring",
    description: "Elegant ring available in multiple colours",
    price: 1500,
    category: "ring",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    variants: [
      // principal image + main colour
      {
        color: "gold",
        image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_1566.jpeg",
      },
      // hover image + second colour
      {
        color: "white",
        image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_1558.jpeg",
      },
      // other option
      {
        color: "black",
        image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_1549.jpeg",
      },
    ],
  },
  {
    id: 302,
    name: "Gold Necklace",
    description: "Elegant gold necklace",
    price: 800,
    category: "necklace",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/necklace1.jpg",
  },
  {
    id: 303,
    name: "Cartier Clou Bracelet",
    description: "Modern bracelet in multiple finishes",
    price: 40,
    category: "bracelet",
    rating: 4.6,
    reviews: 73,
    inStock: true,
    variants: [
      {
        color: "Yellow Gold",
        image: "https://raw.githubusercontent.com/omarhmt08/1collection/main/photo_5825869369337562908_y.jpg",
      },
      {
        color: "White Gold",
        image: "https://raw.githubusercontent.com/omarhmt08/1collection/main/photo_5825869369337562909_y.jpg",
      },
    ],
  },
  {
    id: 304,
    name: "Cartier Love Earrings",
    description: "Classic earrings in different metals",
    price: 40,
    category: "earrings",
    rating: 4.8,
    reviews: 92,
    inStock: true,
    image: "https://raw.githubusercontent.com/omarhmt08/1collection/main/photo_5825869369337562908_y.jpg",
  },
];