import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articles, getArticle, getAllSlugs } from '@/lib/blog-articles'

const SITE_URL = 'https://www.elarain.store'

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: 'Article introuvable' }
  const canonical = `${SITE_URL}/blog/${article.slug}`
  return {
    title: article.seoTitle || article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical },
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.description,
      url: canonical,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [{ url: article.hero, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle || article.title,
      description: article.description,
      images: [article.hero],
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.hero,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: 'Elarain Jewelry', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Elarain Jewelry',
      logo: { '@type': 'ImageObject', url: article.hero },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
    inLanguage: 'fr-MA',
    keywords: article.keywords.join(', '),
  }

  const related = articles.filter(a => a.slug !== article.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10 lg:py-16">
        <nav className="text-xs text-[#9a968c] mb-6">
          <Link href="/" className="hover:text-[#c15f3c]">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/blog" className="hover:text-[#c15f3c]">Blog</Link>
          <span className="mx-2">›</span>
          <span className="text-[#6b6b66]">{article.category}</span>
        </nav>

        <article>
          <header className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c15f3c] font-semibold mb-3">{article.category}</p>
            <h1 className="font-serif text-3xl lg:text-4xl text-[#2c2c2a] leading-tight mb-4">{article.title}</h1>
            <div className="flex items-center gap-3 text-xs text-[#9a968c]">
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </time>
              <span>·</span>
              <span>{article.readingMinutes} min de lecture</span>
            </div>
          </header>

          <p className="text-lg text-[#2c2c2a] leading-relaxed mb-10 italic border-l-2 border-[#c15f3c] pl-4">
            {article.intro}
          </p>

          <div className="space-y-8">
            {article.sections.map((s, i) => (
              <section key={i}>
                {s.heading && (
                  <h2 className="font-serif text-2xl text-[#2c2c2a] mb-4">{s.heading}</h2>
                )}
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="text-[#3c3c3a] leading-[1.75] mb-4">{p}</p>
                ))}
                {s.list && (
                  <ul className="space-y-2 my-4 ml-4">
                    {s.list.map((li, k) => (
                      <li key={k} className="flex gap-2 text-[#3c3c3a] leading-relaxed">
                        <span className="text-[#c15f3c] mt-1.5 flex-shrink-0">•</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-14 bg-white border border-[#e8e6de] rounded-2xl p-6 lg:p-8">
            <p className="text-[#3c3c3a] leading-relaxed mb-5">{article.cta}</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c15f3c] text-white rounded-full text-sm font-semibold hover:bg-[#a84d2e] transition-colors"
            >
              Découvrir la collection
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <aside className="mt-16 pt-10 border-t border-[#e8e6de]">
            <h3 className="font-serif text-xl text-[#2c2c2a] mb-6">À lire aussi</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map(a => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="block bg-white border border-[#e8e6de] rounded-xl p-4 hover:border-[#c15f3c]/40 transition-colors"
                >
                  <p className="text-[10px] uppercase tracking-widest text-[#c15f3c] font-semibold mb-1.5">{a.category}</p>
                  <h4 className="font-serif text-base text-[#2c2c2a] leading-tight line-clamp-2">{a.title}</h4>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
