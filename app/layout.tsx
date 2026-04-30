import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "ELARAIN JEWELRY | High-End Jewelry & Luxury Watches",
    template: "%s | ELARAIN JEWELRY",
  },
  description: "Discover ELARAIN JEWELRY - your ultimate destination for high-end jewelry, luxury watches, and elegant accessories. Shop our exclusive collection today.",
  keywords: ["elarain", "elarain jewelry", "elarain shop", "elarain website", "jewelry", "luxury watches", "high-end jewelry", "accessories", "elarain boutique"],
  authors: [{ name: "ELARAIN JEWELRY" }],
  creator: "ELARAIN JEWELRY",
  publisher: "ELARAIN JEWELRY",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://elarain.com"), // Replace with actual domain if different
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ELARAIN JEWELRY | High-End Jewelry & Luxury Watches",
    description: "Discover ELARAIN JEWELRY - your ultimate destination for luxury accessories and timeless jewelry.",
    url: "https://elarain.com",
    siteName: "ELARAIN JEWELRY",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png",
        width: 800,
        height: 600,
        alt: "ELARAIN JEWELRY Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ELARAIN JEWELRY | High-End Jewelry & Luxury Watches",
    description: "Discover ELARAIN JEWELRY - your ultimate destination for luxury accessories and timeless jewelry.",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png",
        sizes: "180x180",
        type: "image/png",
      }
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "ELARAIN JEWELRY",
              "url": "https://elarain.com",
              "logo": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png",
              "description": "Discover ELARAIN JEWELRY - your ultimate destination for high-end jewelry, luxury watches, and elegant accessories.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "",
                "addressLocality": "Casablanca",
                "addressRegion": "Casablanca-Settat",
                "postalCode": "",
                "addressCountry": "MA"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+212693011454",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://www.tiktok.com/@elarain_jewelry",
                "https://www.instagram.com/elarain_jewelry",
                "https://wa.me/212693011454"
              ]
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans flex flex-col min-h-screen scroll-smooth antialiased`}>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
