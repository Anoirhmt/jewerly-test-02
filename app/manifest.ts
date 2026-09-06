import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Elarain Jewelry — Bijoux & Montres au Maroc',
        short_name: 'Elarain',
        description: 'Boutique de bijoux, montres et accessoires femme au Maroc. Livraison rapide et paiement à la livraison.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#C15F3C',
        lang: 'fr-MA',
        icons: [
            {
                src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    }
}
