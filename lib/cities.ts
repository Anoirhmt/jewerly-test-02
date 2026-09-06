export type City = {
  slug: string
  name: string          // Display name
  altNames: string[]    // For SEO keywords (variations)
  region: string
  deliveryPrice: number // DH
  deliveryTime: string
  intro: string         // First paragraph
  neighborhoods: string[]
  latLng?: { lat: number; lng: number }
}

export const cities: City[] = [
  {
    slug: 'rabat',
    name: 'Rabat',
    altNames: ['Rabat', 'Ribat', 'Rabat capitale'],
    region: 'Rabat-Salé-Kénitra',
    deliveryPrice: 25,
    deliveryTime: '24h',
    intro: "Livraison bijoux Elarain à Rabat en 24h — paiement à la livraison partout dans la capitale du Maroc. Nos coursiers couvrent Agdal, Hassan, Océan, Yacoub El Mansour, Hay Riad et tous les quartiers.",
    neighborhoods: ['Agdal', 'Hassan', 'Océan', 'Hay Riad', 'Souissi', 'Yacoub El Mansour', 'Diour Jamaa', 'L\'Ocean', 'Aviation', 'Médina'],
    latLng: { lat: 34.0209, lng: -6.8416 },
  },
  {
    slug: 'casablanca',
    name: 'Casablanca',
    altNames: ['Casablanca', 'Casa', 'Dar el Beïda'],
    region: 'Casablanca-Settat',
    deliveryPrice: 35,
    deliveryTime: '24-48h',
    intro: "Livraison bijoux Elarain à Casablanca en 24-48h. Que vous soyez à Maârif, Ain Diab, Anfa, Sidi Maârouf ou Bourgogne — on livre partout dans la plus grande ville du Maroc.",
    neighborhoods: ['Maârif', 'Ain Diab', 'Anfa', 'Bourgogne', 'Sidi Maârouf', 'Gauthier', 'Racine', 'CIL', 'Hay Hassani', 'Ain Sebaâ', 'Sbata', 'Derb Ghallef'],
    latLng: { lat: 33.5731, lng: -7.5898 },
  },
  {
    slug: 'marrakech',
    name: 'Marrakech',
    altNames: ['Marrakech', 'Marrakeche', 'Marrakch'],
    region: 'Marrakech-Safi',
    deliveryPrice: 35,
    deliveryTime: '24-48h',
    intro: "Livraison bijoux Elarain à Marrakech en 24-48h. Nos colis atteignent la Médina, Guéliz, Hivernage, Palmeraie, Sidi Youssef et tous les quartiers de la ville ocre.",
    neighborhoods: ['Guéliz', 'Hivernage', 'Médina', 'Palmeraie', 'Sidi Youssef Ben Ali', 'Massira', 'Targa', 'Semlalia', 'M\'hamid'],
    latLng: { lat: 31.6295, lng: -7.9811 },
  },
  {
    slug: 'fes',
    name: 'Fès',
    altNames: ['Fes', 'Fès', 'Fez'],
    region: 'Fès-Meknès',
    deliveryPrice: 35,
    deliveryTime: '48h',
    intro: "Livraison bijoux Elarain à Fès en 48h. On livre dans la Médina, Fès Nouvelle, Aïn Chkef, Route de Sefrou et tous les quartiers de la capitale spirituelle.",
    neighborhoods: ['Fès Nouvelle', 'Médina', 'Aïn Chkef', 'Route de Sefrou', 'Route d\'Immouzer', 'Zouagha', 'Saïss', 'Al Adarissa'],
    latLng: { lat: 34.0181, lng: -5.0078 },
  },
  {
    slug: 'agadir',
    name: 'Agadir',
    altNames: ['Agadir', 'Anza', 'Ait Melloul'],
    region: 'Souss-Massa',
    deliveryPrice: 35,
    deliveryTime: '48h',
    intro: "Livraison bijoux Elarain à Agadir en 48h. On couvre Centre-ville, Founty, Sonaba, Talborjt et zones environnantes de la station balnéaire.",
    neighborhoods: ['Centre-ville', 'Founty', 'Sonaba', 'Talborjt', 'Ihchach', 'Bensergao', 'Tikiouine', 'Ait Melloul'],
    latLng: { lat: 30.4278, lng: -9.5981 },
  },
  {
    slug: 'tanger',
    name: 'Tanger',
    altNames: ['Tanger', 'Tangier', 'Tandja'],
    region: 'Tanger-Tétouan-Al Hoceïma',
    deliveryPrice: 35,
    deliveryTime: '48h',
    intro: "Livraison bijoux Elarain à Tanger en 48h. Nos colis atteignent la Médina, Malabata, Iberia, Beni Makada et toute la baie de Tanger.",
    neighborhoods: ['Médina', 'Malabata', 'Iberia', 'Beni Makada', 'California', 'Marchan', 'Val Fleuri', 'Souani'],
    latLng: { lat: 35.7595, lng: -5.8340 },
  },
  {
    slug: 'sale',
    name: 'Salé',
    altNames: ['Salé', 'Sale', 'Sla', 'Salé Jadida'],
    region: 'Rabat-Salé-Kénitra',
    deliveryPrice: 20,
    deliveryTime: '24h',
    intro: "Livraison bijoux Elarain à Salé en 24h — paiement à la livraison. Nos coursiers couvrent Salé Médina, Salé Jadida, Tabriquet, Bettana et tous les quartiers.",
    neighborhoods: ['Salé Médina', 'Salé Jadida', 'Tabriquet', 'Bettana', 'Sidi Moussa', 'Hay Salam', 'Chmaou'],
    latLng: { lat: 34.0530, lng: -6.7985 },
  },
  {
    slug: 'meknes',
    name: 'Meknès',
    altNames: ['Meknes', 'Meknès', 'Meknass'],
    region: 'Fès-Meknès',
    deliveryPrice: 35,
    deliveryTime: '48h',
    intro: "Livraison bijoux Elarain à Meknès en 48h. On livre dans Ville Nouvelle, Médina, Hamriya, Sidi Baba et tous les quartiers de la ville ismaïlienne.",
    neighborhoods: ['Ville Nouvelle', 'Médina', 'Hamriya', 'Sidi Baba', 'Riad', 'Toulal', 'Al Bassatine'],
    latLng: { lat: 33.8935, lng: -5.5473 },
  },
  {
    slug: 'kenitra',
    name: 'Kénitra',
    altNames: ['Kenitra', 'Kénitra', 'Port Lyautey'],
    region: 'Rabat-Salé-Kénitra',
    deliveryPrice: 35,
    deliveryTime: '48h',
    intro: "Livraison bijoux Elarain à Kénitra en 48h — paiement à la livraison. Nos coursiers atteignent Centre-ville, Bir Rami, Ouled Oujih et tous les secteurs.",
    neighborhoods: ['Centre-ville', 'Bir Rami', 'Ouled Oujih', 'Mimosas', 'Val Fleuri', 'Chourouk'],
    latLng: { lat: 34.2610, lng: -6.5802 },
  },
  {
    slug: 'temara',
    name: 'Temara',
    altNames: ['Temara', 'Témara'],
    region: 'Rabat-Salé-Kénitra',
    deliveryPrice: 25,
    deliveryTime: '24h',
    intro: "Livraison bijoux Elarain à Temara en 24h. Nos coursiers couvrent Temara Centre, Wifak, Massira, Harhoura et environs.",
    neighborhoods: ['Temara Centre', 'Wifak', 'Massira', 'Harhoura', 'Sidi El Yamani', 'Firdaous'],
    latLng: { lat: 33.9287, lng: -6.9067 },
  },
]

export function getCity(slug: string): City | undefined {
  return cities.find(c => c.slug === slug)
}
