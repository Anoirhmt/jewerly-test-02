import type { Product } from "./products";

// Packs products - separate data management for packs page
export const packsProducts: Product[] = [
  {
    id: 201,
    name: "pack1+boite",
    description: "Premium jewelry pack with elegant design",
    price: 199,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/photo_6016821605273029121_y.jpg",
    category: "pack",
    rating: 4.8,
    reviews: 124,
    inStock: true,
  },
  {
    id: 202,
    name: "pack2",
    description: "Luxury jewelry collection pack",
    price: 120,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_1566.jpeg",
    category: "watch",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    variants: [
      {
        color: "red",
        image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_1566.jpeg"
      },
      {
        color: "white",
        image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/Gemini_Generated_Image_oc8fbpoc8fbpoc8f.png"
      },
      {
        color: "black",
        image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_1549.jpeg"
      }
    ]
  },
  {
    id: 203,
    name: "pack3",
    description: "Exclusive jewelry pack set",
    price: 160,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/photo_5870919414453046160_y.jpg",
    category: "pack",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    variants: [
      {
        color: "white",
        image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/photo_5870919414453046160_y.jpg"
      },
      {
        color: "rose",
        image: "/pack203_rose_vancleef.png"
      }
    ]
  },
  {
    id: 204,
    name: "pack4",
    description: "Special edition jewelry pack",
    price: 149,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_3061.jpeg",
    category: "pack",
    rating: 4.6,
    reviews: 73,
    inStock: true,
  },
  {
    id: 205,
    name: "pack5",
    description: "Deluxe jewelry pack collection",
    price: 150,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_3060.jpeg",
    category: "pack",
    rating: 4.8,
    reviews: 92,
    inStock: true,
  },
  {
    id: 206,
    name: "pack6+boite",
    description: "Premium gold jewelry pack",
    price: 199,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_3687.jpeg",
    category: "pack",
    rating: 4.9,
    reviews: 108,
    inStock: true,
  },
  {
    id: 207,
    name: "pack7",
    description: "Silver jewelry pack set",
    price: 99,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/photo_5873068869487282087_y.jpg",
    category: "pack",
    rating: 4.7,
    reviews: 85,
    inStock: true,
  },
  {
    id: 208,
    name: "pack8+boite",
    description: "Elegant b available in multiple colours",
    price: 199,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_4408.png",
    category: "pack",
    rating: 4.9,
    reviews: 89,
    inStock: true,
  },
  {
    id: 209,
    name: "pack9",
    description: "jewelry pack set",
    price: 100,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/photo_5825869369337562936_y.jpg",
    category: "pack",
    rating: 4.5,
    reviews: 564,
    inStock: true,
  },
  {
    id: 210,
    name: "pack 10",
    description: "Premium jewelry collection pack",
    price: 150,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/IMG_3068.jpeg",
    category: "pack",
    rating: 4.8,
    reviews: 112,
    inStock: true,
  },
  {
    id: 211,
    name: "ensemble montre et le article et boite gratuite 😍💋 199 dh",
    description: "باك ساعة مع الإكسسوارات وعلبة مجانية 😍💋 199 درهم",
    price: 199,
    image: "https://raw.githubusercontent.com/omarhmt08/my-first-image/main/photo_6016821605273029121_y.jpg",
    category: "pack",
    rating: 4.9,
    reviews: 78,
    inStock: false,
  },
];
