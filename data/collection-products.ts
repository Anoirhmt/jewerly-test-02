import type { Product } from "./products";

export const collectionProducts: Product[] = [ 
  {
    id: 301,
    name: "Gold Necklace",
    description: "Elegant gold necklace",
    price: 800,
    category: "necklace",
    rating: 4.7,
    reviews: 156,
    inStock: false,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/necklace1.jpg",
  },
  {
    id: 302,
    name: "Cartier Clou Bracelet",
    description: "Modern bracelet in multiple finishes",
    price: 40,
    category: "bracelet",
    rating: 4.6,
    reviews: 73,
    inStock: true,
    variants: [
      {
        color: "gold",
        image: "https://raw.githubusercontent.com/omarhmt08/1collection/main/photo_5825869369337562909_y.jpg",
      },
    ],
  },
  {
    id: 303,
    name: "Cartier Love bracelet",
    description: "Classic bracelet in different metals",
    price: 40,
    category: "bracelet",
    rating: 4.8,
    reviews: 92,
    inStock: true,
    image: "https://raw.githubusercontent.com/omarhmt08/1collection/main/photo_5825869369337562908_y.jpg",
  },
];
