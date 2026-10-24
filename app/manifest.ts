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
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
    }
}
