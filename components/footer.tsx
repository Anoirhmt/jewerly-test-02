import Link from "next/link"
import Image from "next/image"
import { SocialMediaCard } from "@/components/social-media-card"

export function Footer() {
  const policyLinks = [
    { name: "Politique de confidentialité", href: "/politique-confidentialite" },
    { name: "Politique de remboursement", href: "/politique-remboursement" },
    { name: "Conditions d'utilisation", href: "/conditions-utilisation" },
    { name: "Politique d'expédition", href: "/politique-expedition" },
  ]

  return (
    <footer className="relative z-50 bg-white text-black border-t border-black/[0.04] overflow-hidden">
      {/* Top decorative line gradient */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#9b5c5c]/30 to-transparent" />

      <div className="w-full px-8 md:px-16 pt-16 pb-10">
        {/* Main footer grid */}
        <div className="flex flex-col items-center gap-10">
          {/* Logo */}
          <Link href="/" className="group">
            <Image
              src="https://raw.githubusercontent.com/omarhmt08/my-first-image/main/elarain_jewelry_text_only.png"
              alt="Elarain Jewelry"
              width={160}
              height={60}
              className="h-6 w-auto brightness-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700 select-none"
            />
          </Link>

          {/* Tagline */}
          <p className="text-[9px] tracking-[0.45em] uppercase text-black/30 font-light text-center max-w-xs">
            L'art du bijou. L'élégance comme mode de vie.
          </p>

          {/* Social links */}
          <SocialMediaCard />

          {/* Divider */}
          <div className="w-full max-w-xs flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-black/8" />
            <div className="w-[3px] h-[3px] rounded-full bg-[#9b5c5c]/40" />
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-black/8" />
          </div>

          {/* Policy links */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-2 text-center max-w-[90vw]">
            {policyLinks.map((link, index, array) => (
              <div key={link.name} className="flex items-center gap-x-3 sm:gap-x-6">
                <Link
                  href={link.href}
                  className="text-[7px] sm:text-[8px] tracking-[0.18em] sm:tracking-luxury uppercase text-black/30 hover:text-[#9b5c5c] transition-all duration-500 py-1 whitespace-nowrap leading-none"
                >
                  {link.name}
                </Link>
                {index < array.length - 1 && (
                  <span className="text-[7px] text-black/10 shrink-0">·</span>
                )}
              </div>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[8px] tracking-[0.4em] text-black/20 uppercase font-light">
            © 2025 Elarain Jewelry. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* Bottom brand accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#9b5c5c]/20 to-transparent" />
    </footer>
  )
}
