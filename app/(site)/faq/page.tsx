import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://www.elarain.store'

export const metadata: Metadata = {
  title: 'FAQ Elarain — Questions fréquentes sur nos bijoux et livraison',
  description: "Toutes les réponses sur Elarain Jewelry : livraison, paiement à la livraison, retours, garantie, tailles, entretien des bijoux. Questions fréquentes au Maroc.",
  keywords: [
    'faq elarain', 'questions bijoux maroc', 'livraison bijoux maroc',
    'paiement livraison', 'garantie bijoux', 'retour bijoux',
    'comment commander elarain', 'aide elarain', 'support elarain',
  ],
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ Elarain — Questions fréquentes',
    description: 'Livraison, paiement, retours, garantie — toutes les infos.',
    url: `${SITE_URL}/faq`,
    type: 'website',
  },
}

type QA = { q: string; a: string; category: string }

const faqs: QA[] = [
  // Livraison
  { category: 'Livraison', q: 'Chhal kayakhod l\'livraison ? Combien de temps prend la livraison ?', a: 'Livraison en 24h pour Rabat, Salé et Temara. 24-48h pour Casablanca, Marrakech, Kénitra. 48h pour les autres villes du Maroc (Fès, Agadir, Tanger, Meknès, etc.). Ta commande est livrée par Riyalto Express.' },
  { category: 'Livraison', q: 'Kayn livraison pour toutes les villes ? Livrez-vous partout au Maroc ?', a: 'Oui, on livre dans plus de 200 villes et villages au Maroc. Les frais varient entre 20 DH (Salé) et 45 DH (villes éloignées). Prix exact affiché au checkout selon ta ville.' },
  { category: 'Livraison', q: 'Chhal ktekleff l\'livraison ? Combien coûte la livraison ?', a: 'Rabat & Temara : 25 DH. Salé : 20 DH. Casa, Fès, Marrakech, Tanger, Agadir : 35 DH. Villes éloignées (Dakhla, Smara, Chefchaouen) : 45 DH.' },
  { category: 'Livraison', q: 'Est-ce que je peux suivre ma commande ?', a: 'Oui. Après confirmation, tu reçois un numéro de suivi RIYA-XXXXX-XXXXX par WhatsApp. Tu peux le suivre sur users.riyaltoexpress.com ou nous demander une mise à jour via WhatsApp.' },

  // Paiement
  { category: 'Paiement', q: 'Wach paiement à la livraison ? Est-ce que je paye avant ou à la réception ?', a: 'Paiement à la livraison uniquement. Tu ne payes RIEN avant. Le coursier collecte l\'argent (bijou + frais de livraison) au moment où il te remet le colis. Aucun risque, aucun paiement en ligne.' },
  { category: 'Paiement', q: 'Wach kanaqbel les cartes ? Vous acceptez la carte bancaire ?', a: 'Pour le moment, uniquement cash à la livraison. Le coursier n\'a pas de TPE. Prépare le montant exact ou approximatif — pas de problème pour la monnaie.' },
  { category: 'Paiement', q: 'Ila ma khlast ? Que se passe-t-il si je ne paye pas ?', a: 'Si tu ne payes pas, le coursier ramène le colis. Aucune pénalité de notre part, mais tu ne recevras pas le bijou. On te contactera pour comprendre la raison.' },

  // Commande
  { category: 'Commande', q: 'Kifach n commander ? Comment passer commande ?', a: '1) Choisis ton bijou sur elarain.store. 2) Ajoute au panier et remplis tes coordonnées (nom, téléphone, ville, adresse). 3) Sara (notre assistante WhatsApp) te contacte pour confirmer. 4) Livraison en 24-48h.' },
  { category: 'Commande', q: 'Wach kayn commande minimum ? Y a-t-il un montant minimum ?', a: 'Non. Tu peux commander une seule pièce, même à 100 DH. Aucun minimum.' },
  { category: 'Commande', q: 'Nqedar n commander plusieurs bijoux ? Peut-on commander plusieurs articles ?', a: 'Oui, autant que tu veux. Tous les articles sont livrés dans un seul colis avec des frais de livraison uniques.' },
  { category: 'Commande', q: 'Wach ta9dar tsift chi cadeau à quelqu\'un ? Puis-je faire livrer à quelqu\'un d\'autre ?', a: 'Absolument. Mets simplement l\'adresse et téléphone du destinataire au checkout. On peut aussi joindre un message personnalisé gratuit — dis-le à Sara sur WhatsApp.' },

  // Retour & Échange
  { category: 'Retour & Échange', q: 'Wach kayn retour ? Puis-je retourner un bijou ?', a: 'Oui. Tu as 7 jours après réception pour échanger si la taille ne convient pas ou si tu changes d\'avis. Le bijou doit être dans son emballage d\'origine, non porté.' },
  { category: 'Retour & Échange', q: 'Kifach n\'échangi la taille ? Comment changer la taille d\'une bague ?', a: 'Contacte-nous sur WhatsApp +212 693-011454 dans les 7 jours. On t\'envoie un coursier récupérer l\'ancien bijou, et on te livre la nouvelle taille. Frais de coursier à ta charge (25-45 DH selon ville).' },
  { category: 'Retour & Échange', q: 'Wach kayrjaa flouss ? Y a-t-il un remboursement ?', a: 'Nous privilégions l\'échange. En cas de bijou défectueux (rare), remboursement complet possible sur simple demande via WhatsApp.' },

  // Bijoux & Qualité
  { category: 'Qualité', q: 'Wach l\'argent hakikei ? Vos bijoux argent sont-ils authentiques ?', a: 'Oui. Tous nos bijoux "argent" sont en argent sterling 925 (92.5% d\'argent pur), poinçonnés selon les normes marocaines et internationales.' },
  { category: 'Qualité', q: 'Chnou taille standard dyal la bague ? Quelle est la taille standard des bagues ?', a: 'La taille moyenne pour femme au Maroc est le 54 (diamètre 17.2 mm). Si tu n\'es pas sûre, commande le 54 — c\'est la plus fréquente. On échange gratuitement si ça ne convient pas.' },
  { category: 'Qualité', q: 'Kifach n hafd 3la l\'bijoux ? Comment entretenir mes bijoux ?', a: 'Enlève-les avant douche/sport. Range dans un sac ziploc pour éviter oxydation. Nettoie avec un chiffon doux ou du bicarbonate + eau tiède. Notre guide complet est sur /blog/comment-nettoyer-bijoux-argent-maison.' },
  { category: 'Qualité', q: 'Wach kaydwmo bezaf ? Les bijoux tiennent-ils longtemps ?', a: 'Oui, avec un peu d\'entretien. L\'argent 925 peut durer 20-30 ans. Si tu suis les conseils d\'entretien, tes bijoux Elarain vont te durer très longtemps.' },

  // Contact
  { category: 'Contact', q: 'Kifach n contact Elarain ? Comment vous contacter ?', a: 'Le plus rapide : WhatsApp +212 693-011454. On répond en français, darija et arabe, tous les jours entre 9h et 22h. Aussi : Instagram @elarain_jewelry, TikTok @elarain_jewelry.' },
  { category: 'Contact', q: 'Kayn boutique physique ? Avez-vous un magasin physique ?', a: 'Non, Elarain est 100% en ligne. Ça nous permet de proposer des prix plus bas (pas de loyer commercial) et de livrer partout au Maroc au lieu de servir une seule ville.' },
]

const categories = Array.from(new Set(faqs.map(f => f.category)))

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c15f3c] font-semibold mb-3">Aide</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-[#2c2c2a] mb-4">Questions fréquentes</h1>
          <p className="text-[#6b6b66] max-w-xl mx-auto">
            Toutes les réponses sur la livraison, le paiement, les retours et nos bijoux. Une question qui n'est pas ici ? Écris-nous sur WhatsApp.
          </p>
        </header>

        {categories.map(cat => (
          <section key={cat} className="mb-10">
            <h2 className="font-serif text-xl text-[#2c2c2a] mb-4 pb-2 border-b border-[#e8e6de]">{cat}</h2>
            <div className="space-y-3">
              {faqs.filter(f => f.category === cat).map((f, i) => (
                <details key={i} className="group bg-white border border-[#e8e6de] rounded-xl overflow-hidden">
                  <summary className="cursor-pointer px-5 py-4 flex items-start justify-between gap-3 hover:bg-[#faf9f5] transition-colors">
                    <span className="font-medium text-[#2c2c2a] pr-4">{f.q}</span>
                    <span className="text-[#c15f3c] text-xl leading-none flex-shrink-0 mt-0.5 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-5 pb-4 pt-1 text-[#3c3c3a] leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-14 bg-white border border-[#e8e6de] rounded-2xl p-6 lg:p-8 text-center">
          <h2 className="font-serif text-2xl text-[#2c2c2a] mb-3">Autre question ?</h2>
          <p className="text-[#6b6b66] mb-6">
            Notre équipe Elarain répond sur WhatsApp tous les jours entre 9h et 22h. En français, darija ou arabe.
          </p>
          <a
            href="https://wa.me/212693011454"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c15f3c] text-white rounded-full text-sm font-semibold hover:bg-[#a84d2e] transition-colors"
          >
            Écrire sur WhatsApp
          </a>
        </div>

        <div className="mt-10 text-center">
          <Link href="/blog" className="text-sm text-[#c15f3c] hover:underline">Nos guides et conseils sur les bijoux →</Link>
        </div>
      </div>
    </div>
  )
}
