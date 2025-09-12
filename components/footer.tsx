import Link from "next/link"
import { Instagram } from "lucide-react"

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
          <div className="order-first flex space-x-4 mb-4">
            {/* Replace "#" with your actual profile URLs */}
            <Link href="https://www.instagram.com/elarain_jewelry?utm_source=ig_web_button_share_sheet&igsh=d3FhNmszYmh5MzU1" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="https://www.tiktok.com/@elarain_jewelry?is_from_webapp=1&sender_device=pc" aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-6 w-6"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
