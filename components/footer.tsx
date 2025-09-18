import Link from "next/link"
import { SocialMediaCard } from "@/components/social-media-card"

export function Footer() {
  return (
    <footer className="bg-white text-black">
      <div className="container mx-auto px-6 py-16">
        {/* Only the bottom section remains */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col items-center">
          <p className="text-black text-[10px] mt-6 md:mt-2">© 2024 ELARAIN JEWELRY.</p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-3 mt-6 md:mt-2 text-[10px] tracking-wide uppercase text-black">
            <Link
              href="/politique-confidentialite"
              className="text-black hover:text-gray-800 transition-colors"
            >
              Politique de confidentialité
            </Link>
            <span className="text-black text-[10px]">•</span>
            <Link
              href="/politique-remboursement"
              className="text-gray-600 hover:text-black transition-colors font-light"
            >
              Politique de remboursement
            </Link>
            <span className="text-gray-400 text-xs">•</span>
            <Link
              href="/conditions-utilisation"
              className="text-black hover:text-gray-800 transition-colors"
            >
              Conditions d'utilisation
            </Link>
            <span className="text-black">•</span>
            <Link href="/politique-expedition" className="text-black hover:text-gray-800 transition-colors">
              Politique d'expédition
            </Link>
          </div>
          <div className="order-first mb-8">
            <SocialMediaCard />
          </div>
        </div>
      </div>
    </footer>
  )
}
