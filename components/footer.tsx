import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Only the bottom section remains */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 font-light text-sm">© 2024 ELARAIN JEWELRY. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 mt-4 md:mt-0 text-sm">
            <Link
              href="/politique-confidentialite"
              className="text-gray-400 hover:text-white transition-colors font-light"
            >
              Politique de confidentialité
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/politique-remboursement"
              className="text-gray-400 hover:text-white transition-colors font-light"
            >
              Politique de remboursement
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/conditions-utilisation"
              className="text-gray-400 hover:text-white transition-colors font-light"
            >
              Conditions d'utilisation
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/politique-expedition" className="text-gray-400 hover:text-white transition-colors font-light">
              Politique d'expédition
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
