import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ELARAIN JEWELRY',
        short_name: 'ELARAIN',
        description: 'High-End Jewelry & Luxury Watches',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    }
}
