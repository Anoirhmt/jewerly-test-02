import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/checkout/'],
        },
        sitemap: 'https://elarain.com/sitemap.xml',
    }
}
