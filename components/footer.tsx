import Link from "next/link"
import { SocialMediaCard } from "@/components/social-media-card"

export function Footer() {
  return (
    <footer className="relative z-50 bg-white text-black border-t border-black/[0.03]">
      <div className="w-full px-8 md:px-12 py-8">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <SocialMediaCard />
          </div>
          
          <div className="flex flex-row flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-2 mb-6 text-center max-w-[90vw] mx-auto">
            {[
              { name: "Politique de confidentialité", href: "/politique-confidentialite" },
              { name: "Politique de remboursement", href: "/politique-remboursement" },
              { name: "Conditions d'utilisation", href: "/conditions-utilisation" },
              { name: "Politique d'expédition", href: "/politique-expedition" },
            ].map((link, index, array) => (
              <div key={link.name} className="flex items-center gap-x-2 sm:gap-x-4">
                <Link
                  href={link.href}
                  className="text-[7px] sm:text-[9px] tracking-[0.15em] sm:tracking-luxury-lg uppercase text-black/40 hover:text-black transition-all duration-700 ease-in-out py-1 cursor-pointer relative z-[60] whitespace-nowrap"
                >
                  {link.name}
                </Link>
                {index < array.length - 1 && (
                  <span className="text-[7px] sm:text-[9px] text-black/10">/</span>
                )}
              </div>
            ))}
          </div>

          <div className="w-12 h-[1px] bg-black/5 mb-6" />

          <p className="text-[9px] tracking-luxury-xl text-black/20 uppercase font-light">© 2024 ELARAIN JEWELRY. TOUS DROITS RÉSERVÉS.</p>
        </div>
      </div>
    </footer>
  );
}
