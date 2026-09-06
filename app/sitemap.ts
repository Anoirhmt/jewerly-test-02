import { MetadataRoute } from 'next'
import { articles } from '@/lib/blog-articles'
import { cities } from '@/lib/cities'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.elarain.store'
    const now = new Date()

    const main = [
        { url: `${baseUrl}`,                            lastModified: now, changeFrequency: 'daily'   as const, priority: 1.0 },
        { url: `${baseUrl}/products`,                   lastModified: now, changeFrequency: 'daily'   as const, priority: 0.9 },
        { url: `${baseUrl}/packs`,                      lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.9 },
        { url: `${baseUrl}/watches`,                    lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.9 },
        { url: `${baseUrl}/blog`,                       lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.8 },
        { url: `${baseUrl}/faq`,                        lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/cart`,                       lastModified: now, changeFrequency: 'monthly' as const, priority: 0.3 },
        { url: `${baseUrl}/conditions-utilisation`,     lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.2 },
        { url: `${baseUrl}/politique-confidentialite`,  lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.2 },
        { url: `${baseUrl}/politique-expedition`,       lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.2 },
        { url: `${baseUrl}/politique-remboursement`,    lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.2 },
    ]

    const blogPages = articles.map(a => ({
        url: `${baseUrl}/blog/${a.slug}`,
        lastModified: new Date(a.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    const cityPages = cities.map(c => ({
        url: `${baseUrl}/livraison/${c.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    return [...main, ...blogPages, ...cityPages]
}
