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

const SITE_URL = "https://www.elarain.store"
const SITE_NAME = "ELARAIN JEWELRY"
const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png"

export const metadata: Metadata = {
  title: {
    default: "Elarain Jewelry — Bijoux & Montres de Luxe au Maroc | Livraison Rabat, Casa, Marrakech",
    template: "%s | Elarain Jewelry",
  },
  description:
    "Elarain Jewelry — boutique de bijoux, montres et accessoires femme au Maroc. Livraison rapide 24-48h à Rabat, Casablanca, Marrakech, Agadir. Paiement à la livraison. Collection exclusive de bijoux marocains modernes.",
  keywords: [
    // Brand
    "elarain", "elarain jewelry", "elarain store", "elarain maroc", "elarain bijoux",
    // Product categories (French — most searched in Morocco)
    "bijoux femme", "bijoux marocains", "bijoux luxe", "bracelet femme", "collier femme",
    "bague femme", "boucles d'oreilles", "montres femme", "montres luxe", "accessoires femme",
    "cadeau femme", "cadeaux femme", "cadeau anniversaire femme",
    // Cities (local SEO)
    "bijoux rabat", "bijoux casablanca", "bijoux marrakech", "bijoux agadir",
    "bijoux fes", "bijoux tanger", "bijoux salé", "bijoux temara",
    "montres rabat", "montres casablanca", "accessoires rabat", "accessoires casa",
    // Delivery & payment
    "livraison maroc", "livraison rabat", "livraison casablanca", "paiement à la livraison",
    "boutique bijoux en ligne maroc", "commande bijoux maroc",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "fr-MA": "/",
      "fr": "/",
    },
  },
  openGraph: {
    title: "Elarain Jewelry — Bijoux & Montres de Luxe au Maroc",
    description:
      "Boutique de bijoux, montres et accessoires femme au Maroc. Livraison 24-48h à Rabat, Casa, Marrakech. Paiement à la livraison.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Elarain Jewelry — Bijoux et Montres au Maroc",
      },
    ],
    locale: "fr_MA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elarain Jewelry — Bijoux & Montres de Luxe au Maroc",
    description:
      "Bijoux, montres et accessoires femme. Livraison rapide au Maroc, paiement à la livraison.",
    images: [LOGO_URL],
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
    icon: [{ url: LOGO_URL, type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: [{ url: LOGO_URL, sizes: "180x180", type: "image/png" }],
  },
  verification: {
    // Add your Google Search Console verification code here later
    // google: "abcd1234...",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Store", "JewelryStore", "LocalBusiness"],
        "@id": `${SITE_URL}/#store`,
        "name": SITE_NAME,
        "alternateName": ["Elarain", "Elarain Store", "Elarain Bijoux"],
        "url": SITE_URL,
        "logo": LOGO_URL,
        "image": LOGO_URL,
        "description":
          "Boutique de bijoux, montres et accessoires femme au Maroc. Livraison rapide 24-48h et paiement à la livraison.",
        "priceRange": "50-2000 MAD",
        "currenciesAccepted": "MAD",
        "paymentAccepted": "Cash on delivery",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Rabat",
          "addressRegion": "Rabat-Salé-Kénitra",
          "addressCountry": "MA",
        },
        "areaServed": [
          { "@type": "City", "name": "Rabat" },
          { "@type": "City", "name": "Casablanca" },
          { "@type": "City", "name": "Marrakech" },
          { "@type": "City", "name": "Fes" },
          { "@type": "City", "name": "Agadir" },
          { "@type": "City", "name": "Tanger" },
          { "@type": "City", "name": "Salé" },
          { "@type": "City", "name": "Temara" },
          { "@type": "Country", "name": "Morocco" },
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+212693011454",
          "contactType": "customer service",
          "areaServed": "MA",
          "availableLanguage": ["French", "Arabic", "English"],
        },
        "sameAs": [
          "https://www.tiktok.com/@elarain_jewelry",
          "https://www.instagram.com/elarain_jewelry",
          "https://wa.me/212693011454",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": SITE_NAME,
        "inLanguage": "fr-MA",
        "publisher": { "@id": `${SITE_URL}/#store` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${SITE_URL}/products?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }

  return (
    <html lang="fr-MA">
      <head>
        <link rel="canonical" href={SITE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
