import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/context/cart-context"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import Image from "next/image"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "ELARAIN JEWELRY",
  description: "Discover amazing products at unbeatable prices",
  generator: "v0.dev",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png",
        type: "image/png",
      },
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
      <body className={`${inter.variable} ${playfair.variable} font-sans flex flex-col min-h-screen`}>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          {/* WhatsApp floating button */}
          <Link href="https://wa.me/212690751065" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg">
            <Image src="/whatsapp.png" alt="WhatsApp" width={48} height={48} priority />
          </Link>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
