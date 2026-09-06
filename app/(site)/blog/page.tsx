import type { Metadata } from 'next'
import Link from 'next/link'
import { articles } from '@/lib/blog-articles'

const SITE_URL = 'https://www.elarain.store'

export const metadata: Metadata = {
  title: 'Blog Elarain — Guides bijoux, tendances & conseils au Maroc',
  description: 'Découvrez nos guides pratiques sur les bijoux, montres et accessoires au Maroc : entretien, tendances 2026, cadeaux, mariage marocain et plus.',
  keywords: ['blog bijoux maroc', 'guide bijoux', 'tendances bijoux 2026', 'entretien bijoux', 'cadeau bijoux'],
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog Elarain — Guides bijoux, tendances & conseils',
    description: 'Guides pratiques sur les bijoux au Maroc.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
}

export default function BlogIndexPage() {
  const sorted = [...articles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c15f3c] font-semibold mb-3">Journal</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-[#2c2c2a] mb-4">Blog Elarain</h1>
          <p className="text-[#6b6b66] max-w-xl mx-auto">
            Guides, tendances et conseils pratiques pour choisir, offrir et entretenir vos bijoux au Maroc.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {sorted.map(a => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="group bg-white border border-[#e8e6de] rounded-2xl p-6 transition-all hover:border-[#c15f3c]/40 hover:shadow-sm"
            >
              <p className="text-[10px] uppercase tracking-widest text-[#c15f3c] font-semibold mb-2">{a.category}</p>
              <h2 className="font-serif text-xl text-[#2c2c2a] mb-2 group-hover:text-[#c15f3c] transition-colors leading-snug">
                {a.title}
              </h2>
              <p className="text-sm text-[#6b6b66] leading-relaxed mb-4 line-clamp-3">{a.description}</p>
              <div className="flex items-center gap-3 text-xs text-[#9a968c]">
                <time dateTime={a.publishedAt}>
                  {new Date(a.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>{a.readingMinutes} min de lecture</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-[#6b6b66] mb-4">Envie de découvrir nos collections ?</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c15f3c] text-white rounded-full text-sm font-semibold hover:bg-[#a84d2e] transition-colors"
          >
            Voir les bijoux Elarain
          </Link>
        </div>
      </div>
    </div>
  )
}
