import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cities, getCity } from '@/lib/cities'

const SITE_URL = 'https://www.elarain.store'

export function generateStaticParams() {
  return cities.map(c => ({ city: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const c = getCity(city)
  if (!c) return { title: 'Ville introuvable' }
  const title = `Livraison bijoux à ${c.name} — ${c.deliveryTime}, ${c.deliveryPrice} DH | Elarain`
  const description = `Livraison bijoux, montres et accessoires femme à ${c.name} en ${c.deliveryTime}. Paiement à la livraison, ${c.deliveryPrice} DH de frais. Elarain Jewelry livre partout : ${c.neighborhoods.slice(0, 5).join(', ')} et plus.`
  return {
    title,
    description,
    keywords: [
      `bijoux ${c.name}`, `livraison bijoux ${c.name}`, `montres ${c.name}`,
      `accessoires femme ${c.name}`, `cadeau bijoux ${c.name}`,
      `boutique bijoux ${c.name}`, `elarain ${c.name}`,
      `paiement livraison ${c.name}`,
      ...c.altNames.map(n => `bijoux ${n}`),
    ],
    alternates: { canonical: `/livraison/${c.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/livraison/${c.slug}`,
      type: 'website',
    },
  }
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const c = getCity(city)
  if (!c) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/livraison/${c.slug}#business`,
    name: `Elarain Jewelry — Livraison ${c.name}`,
    description: `Boutique de bijoux et montres en ligne. Livraison à ${c.name} en ${c.deliveryTime} avec paiement à la livraison.`,
    url: `${SITE_URL}/livraison/${c.slug}`,
    telephone: '+212693011454',
    priceRange: '50-2000 MAD',
    areaServed: {
      '@type': 'City',
      name: c.name,
      containedInPlace: { '@type': 'AdministrativeArea', name: c.region },
      ...(c.latLng ? {
        geo: { '@type': 'GeoCoordinates', latitude: c.latLng.lat, longitude: c.latLng.lng },
      } : {}),
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Livraison bijoux ${c.name}`,
      itemListElement: [{
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: `Livraison bijoux à ${c.name}` },
        price: c.deliveryPrice,
        priceCurrency: 'MAD',
        availability: 'https://schema.org/InStock',
      }],
    },
  }

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <nav className="text-xs text-[#9a968c] mb-6">
          <Link href="/" className="hover:text-[#c15f3c]">Accueil</Link>
          <span className="mx-2">›</span>
          <span className="text-[#6b6b66]">Livraison {c.name}</span>
        </nav>

        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c15f3c] font-semibold mb-3">Livraison</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-[#2c2c2a] leading-tight mb-4">
            Livraison bijoux à {c.name}
          </h1>
          <p className="text-lg text-[#3c3c3a] leading-relaxed max-w-2xl">{c.intro}</p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white border border-[#e8e6de] rounded-2xl p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-[#9a968c] font-semibold mb-2">Délai</p>
            <p className="font-serif text-2xl text-[#c15f3c]">{c.deliveryTime}</p>
          </div>
          <div className="bg-white border border-[#e8e6de] rounded-2xl p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-[#9a968c] font-semibold mb-2">Frais</p>
            <p className="font-serif text-2xl text-[#c15f3c]">{c.deliveryPrice} DH</p>
          </div>
          <div className="bg-white border border-[#e8e6de] rounded-2xl p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-[#9a968c] font-semibold mb-2">Paiement</p>
            <p className="font-serif text-2xl text-[#c15f3c]">Livraison</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="font-serif text-2xl text-[#2c2c2a] mb-4">Quartiers desservis à {c.name}</h2>
          <p className="text-[#3c3c3a] leading-relaxed mb-4">
            Nos coursiers Riyalto Express livrent partout à {c.name}. Voici quelques quartiers où nous avons déjà de nombreux clients satisfaits :
          </p>
          <div className="flex flex-wrap gap-2">
            {c.neighborhoods.map(n => (
              <span key={n} className="px-4 py-1.5 bg-white border border-[#e8e6de] rounded-full text-sm text-[#3c3c3a]">
                {n}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-2xl text-[#2c2c2a] mb-4">Comment commander à {c.name} ?</h2>
          <ol className="space-y-4">
            {[
              { title: 'Choisis ton bijou', desc: `Parcours notre catalogue en ligne. Bagues, colliers, bracelets, montres — livraison ${c.name} garantie.` },
              { title: 'Passe commande', desc: 'Remplis le formulaire avec ton adresse et ton téléphone. Aucun paiement en ligne requis.' },
              { title: 'Confirmation WhatsApp', desc: 'Notre assistante Sara te contacte sur WhatsApp pour confirmer ta commande.' },
              { title: `Livraison en ${c.deliveryTime}`, desc: `Un coursier Riyalto Express t'apporte le colis directement chez toi à ${c.name}. Tu payes ${c.deliveryPrice} DH de livraison + le prix du bijou au coursier.` },
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#c15f3c] text-white flex items-center justify-center font-semibold">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-[#2c2c2a] mb-1">{step.title}</h3>
                  <p className="text-[#6b6b66] leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-2xl text-[#2c2c2a] mb-4">Pourquoi Elarain à {c.name} ?</h2>
          <ul className="grid gap-3">
            <li className="flex gap-3 text-[#3c3c3a]"><span className="text-[#c15f3c] mt-1">✓</span><span><strong>Paiement à la livraison</strong> — tu ne payes qu'à la réception du colis, aucun risque</span></li>
            <li className="flex gap-3 text-[#3c3c3a]"><span className="text-[#c15f3c] mt-1">✓</span><span><strong>Bijoux garantis</strong> — argent 925 certifié, montres avec garantie</span></li>
            <li className="flex gap-3 text-[#3c3c3a]"><span className="text-[#c15f3c] mt-1">✓</span><span><strong>Échange gratuit</strong> — 7 jours pour changer si la taille ne convient pas</span></li>
            <li className="flex gap-3 text-[#3c3c3a]"><span className="text-[#c15f3c] mt-1">✓</span><span><strong>Coffret cadeau offert</strong> — chaque bijou est livré prêt à offrir</span></li>
            <li className="flex gap-3 text-[#3c3c3a]"><span className="text-[#c15f3c] mt-1">✓</span><span><strong>Support WhatsApp</strong> — notre équipe répond en français, darija ou arabe</span></li>
          </ul>
        </section>

        <div className="bg-white border border-[#e8e6de] rounded-2xl p-6 lg:p-8 text-center">
          <h2 className="font-serif text-2xl text-[#2c2c2a] mb-3">Prêt(e) à commander à {c.name} ?</h2>
          <p className="text-[#6b6b66] mb-6">Livraison en {c.deliveryTime}, paiement à la réception. Aucun engagement.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#c15f3c] text-white rounded-full text-sm font-semibold hover:bg-[#a84d2e] transition-colors"
          >
            Voir la collection Elarain
          </Link>
        </div>

        <div className="mt-14 pt-8 border-t border-[#e8e6de]">
          <p className="text-xs uppercase tracking-widest text-[#9a968c] font-semibold mb-4">Livraison autres villes</p>
          <div className="flex flex-wrap gap-2">
            {cities.filter(o => o.slug !== c.slug).map(o => (
              <Link
                key={o.slug}
                href={`/livraison/${o.slug}`}
                className="px-4 py-1.5 bg-white border border-[#e8e6de] rounded-full text-sm text-[#3c3c3a] hover:border-[#c15f3c]/40 hover:text-[#c15f3c] transition-colors"
              >
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
