import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.elarain.store'
    const now = new Date()

    return [
        { url: `${baseUrl}`,                            lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
        { url: `${baseUrl}/products`,                   lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
        { url: `${baseUrl}/packs`,                      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
        { url: `${baseUrl}/watches`,                    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
        { url: `${baseUrl}/cart`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
        { url: `${baseUrl}/conditions-utilisation`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
        { url: `${baseUrl}/politique-confidentialite`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
        { url: `${baseUrl}/politique-expedition`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
        { url: `${baseUrl}/politique-remboursement`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    ]
}
