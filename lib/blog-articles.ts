// SEO-seeded articles targeting trending Moroccan French jewelry searches.
// Written to rank fast for low-competition long-tail queries.

export type Section = {
  heading?: string
  paragraphs: string[]
  list?: string[]
}

export type Article = {
  slug: string
  title: string          // Used as H1 + meta title
  seoTitle: string       // Optional shorter meta title
  description: string    // Meta description
  publishedAt: string    // ISO date
  updatedAt: string
  category: string
  readingMinutes: number
  keywords: string[]
  hero: string           // Image URL
  intro: string          // First paragraph (excerpt)
  sections: Section[]
  cta: string            // Closing CTA text
}

const LOGO = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png'

export const articles: Article[] = [
  {
    slug: 'comment-nettoyer-bijoux-argent-maison',
    title: 'Comment nettoyer un bracelet en argent à la maison — guide simple',
    seoTitle: 'Nettoyer bracelet argent à la maison : 5 méthodes qui marchent',
    description: "3afak bghiti nettoyer bijoux argent dyalek f dar bla ma tkhssrhom ? Voici 5 méthodes simples et testées : bicarbonate, dentifrice, savon doux et plus. Guide pratique.",
    publishedAt: '2026-01-08',
    updatedAt: '2026-01-08',
    category: 'Entretien',
    readingMinutes: 5,
    keywords: ['nettoyer bracelet argent', 'entretien bijoux argent', 'comment nettoyer bijoux maison', 'bijoux argent noircis', 'nettoyage argent maroc', 'kifach nettoyer argent'],
    hero: LOGO,
    intro: "Wach bracelet dyalek f l'argent bda kayn 3lih des taches noires ? Ma tkhafch — c'est complètement normal. L'argent kaytefaghal m3a l'air w kaytkhalt. Fhad la maquette, ghadi n3etiwk 5 méthodes simples bach nettoyer bijoux dyalek f dar bla ma tmshi 3nd l'bijoutier.",
    sections: [
      {
        heading: 'Pourquoi l\'argent devient noir ?',
        paragraphs: [
          "L'argent sterling (925) kayreagi m3a le soufre li kayn f l'air, dans la peau, et f certains produits (parfum, savon, sueur). C'est ce qu'on appelle l'oxydation — machi salissure, ghi une réaction chimique.",
          "Bonne nouvelle : c'est totalement réversible en quelques minutes m3a des produits li 3ndek f la cuisine.",
        ],
      },
      {
        heading: 'Méthode 1 — Bicarbonate + aluminium (la plus efficace)',
        paragraphs: [
          "Hadi hia l'meilleure méthode li ma3endekch feha 7ata nsib khsara sur les pierres. Kaymshi nutrition dyal l'argent tal9ai bhal jdid.",
        ],
        list: [
          "Ghelli ma f casserole (l'ma kbir m3ak tra khodya)",
          "Dir wr9 aluminium f qa3 d'un bol",
          "Zid 2 cuillères bicarbonate + 1 cuillère sel",
          "Sob l'ma sakhon f l'bol",
          "Ghis bijoux 5 minutes",
          "Rince b l'ma bareda + jaffef b tissu doux",
        ],
      },
      {
        heading: 'Méthode 2 — Dentifrice',
        paragraphs: [
          "Wakha simple, dentifrice blanc (machi gel !) kaykhdem parfait 3la des taches légères. Dir chwiya sur brosse à dents douce, frotte doucement, w rince.",
          "⚠️ Attention : ma dirch had la méthode 3la des perles wla pierres fragiles.",
        ],
      },
      {
        heading: 'Méthode 3 — Savon doux + eau tiède',
        paragraphs: [
          "Ila l'argent dyalek machi noirci bezaf, ghi kayn 3lih du gras aw poussière, savon doux b l'ma dafya kaykfi. 5-10 min ghis w rince.",
        ],
      },
      {
        heading: 'Méthode 4 — Vinaigre blanc',
        paragraphs: [
          "Ghis bijoux f vinaigre blanc + chwiya bicarbonate 2-3 heures, rince m3a l'ma. Efficace 3la l'argent bien noirci.",
        ],
      },
      {
        heading: 'Méthode 5 — Chiffon de polissage (le plus safe)',
        paragraphs: [
          "Ila 3endek chi bijoux thmin bezaf wla m3a des pierres, khud chiffon spécial argent (kayjab f les bijouteries). Ma khass ta l'ma. Ghi frotte doucement dqai9 chwiya w daba kayjib l'lumière.",
        ],
      },
      {
        heading: 'Conseils pour éviter que ça noircisse',
        paragraphs: ["Prévention khir mn traitement. Voici quelques habitudes :"],
        list: [
          "Enlève bijoux 9bel ma tdakhal l'douche wla la piscine",
          "Ma dirhomch pendant sport (sueur = ennemi #1)",
          "Sob parfum awwal, bad hadchi khada bijoux",
          "Stocke f un sac ziploc fermé m3a un morceau de craie",
          "Porte-les souvent ! L'contact m3a la peau kayretarder l'oxydation",
        ],
      },
    ],
    cta: "3endna collection bijoux argent 925 avec certificat d'authenticité. Livraison partout au Maroc 24-48h, paiement à la livraison. Découvre nos bracelets, colliers et bagues sur elarain.store.",
  },

  {
    slug: 'cadeau-bijoux-fete-des-meres-maroc-2026',
    title: 'Cadeau bijoux pour maman — Fête des Mères Maroc 2026',
    seoTitle: 'Cadeau bijoux Fête des Mères 2026 Maroc — idées + livraison',
    description: "Fête des Mères 2026 kayjik 26 mai. Voici 8 idées cadeau bijoux à offrir à maman : bracelet gravé, collier personnalisé, montre élégante. Livraison Maroc 24h.",
    publishedAt: '2026-01-06',
    updatedAt: '2026-01-06',
    category: 'Cadeaux',
    readingMinutes: 4,
    keywords: ['cadeau fête des mères maroc', 'cadeau maman bijoux', 'fête des mères 2026', 'cadeau maman rabat', 'cadeau anniversaire maman', 'idée cadeau maman'],
    hero: LOGO,
    intro: "Fête des Mères f Maroc kayjik yom 26 mai 2026. Mama kat khass 3lik jamais, o hia toujours pense 3lik. Ma zin men chi cadeau bijoux li ghadi tbaqi m3aha pour toujours ? Voici 8 idées adaptées, m3a les prix et livraison partout f l'Maroc.",
    sections: [
      {
        heading: '1. Bracelet gravé avec son prénom',
        paragraphs: [
          "Cadeau li mama ma 3merha ghadi tensah. Un fin bracelet en argent 925 gravé b smitha wla b une date importante (naissance dyalek, dyal khouk...). Prix : à partir de 250 DH.",
          "Pourquoi ça marche : personnel, élégant, portable kol yom.",
        ],
      },
      {
        heading: '2. Collier avec pendentif cœur',
        paragraphs: [
          "Classique ma yb'lach. Un pendentif cœur f l'argent wla bi une petite pierre bleue. Kayrmz l'amour dyalek. Mamas kayhabbou hadchi bezaf.",
        ],
      },
      {
        heading: '3. Boucles d\'oreilles perle',
        paragraphs: [
          "Perles = élégance intemporelle. Adaptées à tous les âges, kaymshiw m3a n'importe quelle tenue. Cadeau bezaf zwin f entre 200 et 500 DH.",
        ],
      },
      {
        heading: '4. Montre femme classique',
        paragraphs: [
          "Ila mama kat porte des montres, hadi occasion pour zwin. Montre bracelet cuir wla acier avec cadran sobre. Investment li ghadi t3ammer sanwat.",
        ],
      },
      {
        heading: '5. Pack cadeau (collier + bracelet + boucles)',
        paragraphs: [
          "Pack complet f coffret zwin, prêt à offrir. Zawwid la surprise en une seule ouverture. Chez Elarain, packs cadeau commencent à 199 DH.",
        ],
      },
      {
        heading: '6. Bague fine avec pierre naissance',
        paragraphs: [
          "Chaque mois d'naissance 3endo une pierre : grenat (janvier), améthyste (février), aigue-marine (mars)... Bague avec la pierre dyal shhr dyal mama = cadeau bezaf personnel.",
        ],
      },
      {
        heading: '7. Chaîne cheville (khalkhal)',
        paragraphs: [
          "Retour f la mode f Maroc. Simple, élégante, khalkhal en argent kayjib un touche féminine. Bien pour l'été.",
        ],
      },
      {
        heading: '8. Bijou berbère moderne',
        paragraphs: [
          "Pour mama li kathab tradition, un pendentif berbère moderne (fibule, khamsa) f version chic. Cultural + tendance.",
        ],
      },
      {
        heading: 'Conseils avant d\'acheter',
        paragraphs: ["Bach t3merch tekhtar mal, voici quelques questions à te poser :"],
        list: [
          "Wach mama tabbash l'or, l'argent, wla les deux ?",
          "Chnou li kat porte kol yom ? (regarde son style habituel)",
          "3endeha chi allergie l'certains métaux ?",
          "Wach kathab quelque chose de discret wla plus flashy ?",
          "Wach 3endek une date à graver ? (anniversaire, mariage...)",
        ],
      },
    ],
    cta: "Chez Elarain Jewelry, tous nos bijoux sont livrés dans un coffret cadeau gratuit, avec message personnalisé si tu veux. Commande jusqu'au 24 mai pour recevoir avant la Fête des Mères. Livraison 24-48h partout au Maroc.",
  },

  {
    slug: 'tendances-bijoux-femme-2026-maroc',
    title: 'Tendances bijoux femme 2026 au Maroc — ce qui se porte cette année',
    seoTitle: 'Tendances bijoux 2026 : layering, dorée, minimalisme au Maroc',
    description: "Découvre les 6 tendances bijoux femme 2026 au Maroc : layering colliers, or jaune, minimalisme, perles modernes, pierres colorées. Guide + inspirations.",
    publishedAt: '2026-01-05',
    updatedAt: '2026-01-05',
    category: 'Tendances',
    readingMinutes: 4,
    keywords: ['tendance bijoux 2026', 'mode bijoux femme maroc', 'bijoux tendance', 'layering colliers', 'or jaune tendance', 'bijoux minimalistes'],
    hero: LOGO,
    intro: "L'année 2026 kajib m3aha des styles nouveaux dans l'monde des bijoux. Certaines tendances des années précédentes ba9ya, w des nouvelles kaydkhloú. Voici 6 tendances li kolla femme au Maroc khass t3ref f had l'année.",
    sections: [
      {
        heading: '1. Le layering — superposer plusieurs colliers',
        paragraphs: [
          "Al'akbar tendance li ba9ya f 2026 : superposer 2, 3, voire 4 colliers de longueurs différentes. Kayo3ti dimension w profondeur au look.",
          "Astuce : mélange metals (or + argent) — hadchi ancien tabou, daba c'est LA tendance.",
        ],
      },
      {
        heading: '2. L\'or jaune fait son grand retour',
        paragraphs: [
          "Sanwat, tout le monde kan yalbes rose gold w silver. En 2026, l'or jaune classique kayarj3 kbir. Il apporte de la chaleur au teint, o kayjib touche vintage-chic.",
        ],
      },
      {
        heading: '3. Bijoux minimalistes',
        paragraphs: [
          "Fines chaînes, petits pendentifs, anneaux simples. Le principe : less is more. Bijoux qu'on porte kolyom sans avoir besoin de les enlever.",
        ],
      },
      {
        heading: '4. Perles modernes',
        paragraphs: [
          "Les perles ma ba9ach dyal grand-mère ! En 2026, elles se portent en styles asymétriques, mélangées avec chaînes en or, sur des baroques colliers. Fresh et moderne.",
        ],
      },
      {
        heading: '5. Pierres colorées',
        paragraphs: [
          "Améthyste violet, aigue-marine bleu, citrine jaune, grenat rouge. Les pierres semi-précieuses colorées kaydkholoú fort. Adaptées à toutes les saisons.",
        ],
      },
      {
        heading: '6. Bijoux ethniques modernisés',
        paragraphs: [
          "Motifs berbères, symboles marocains, dessins traditionnels — mais dans une version épurée et moderne. Ideal pour porter fièrement la culture avec un twist contemporain.",
        ],
      },
    ],
    cta: "Notre collection Elarain 2026 intègre toutes ces tendances : layering sets, bijoux minimalistes, or jaune moderne. Découvre-les sur elarain.store avec livraison rapide au Maroc.",
  },

  {
    slug: 'bijoux-mariage-marocain-moderne-guide-prix',
    title: 'Bijoux pour mariage marocain moderne : guide complet 2026',
    seoTitle: 'Bijoux mariage marocain moderne : idées + prix + où acheter',
    description: "Ghadi tefrat wla ghadi tefrat khtek/khouk ? Guide complet des bijoux mariage marocain moderne : takchita, alliance, cadeau invité. Prix et livraison Maroc.",
    publishedAt: '2026-01-03',
    updatedAt: '2026-01-03',
    category: 'Mariage',
    readingMinutes: 6,
    keywords: ['bijoux mariage marocain', 'bijoux mariée maroc', 'bijoux takchita', 'alliance mariage maroc', 'cadeau mariage bijoux', 'idées bijoux mariage'],
    hero: LOGO,
    intro: "L'wlida marocaine c'est un événement kbir li khass planning bezaf. L'bijoux hom l'complément principal dyal la mariée. Voici guide complet 2026 : chnou tekhtar, chhal kayeswa, o fin tsawwibh.",
    sections: [
      {
        heading: 'Bijoux pour la mariée',
        paragraphs: [
          "La mariée moderne kathb combinaison bin tradition o modernité. Les incontournables :",
        ],
        list: [
          "Parure complète (collier + boucles + bracelet) assortie à la takchita principale",
          "Diadème ou couronne (souvent loué chez le bijoutier)",
          "Bagues, dont l'alliance et une bague de cocktail plus imposante",
          "Khamsa en pendentif — symbole protecteur, très porté",
        ],
      },
      {
        heading: 'Alliance : or, argent ou platine ?',
        paragraphs: [
          "L'or 18 carats reste le classique le plus demandé au Maroc (chaleur + valeur). L'argent est plus abordable et moderne. Le platine c'est pour les budgets élevés — inaltérable mais cher.",
          "Prix moyen alliance en 2026 : Or 18k : 3000-8000 DH · Argent : 400-1200 DH · Platine : 5000-15000 DH.",
        ],
      },
      {
        heading: 'Combien de tenues, combien de bijoux ?',
        paragraphs: [
          "F l'mariage classique marocaine, la mariée change 3-7 takchitas. Ma khass tekhss bijoux dyal kola tenue tkun 3ndha style dyalha :",
        ],
        list: [
          "Takchita blanche : perles ou or blanc",
          "Takchita rose/vert : bijoux en or jaune avec pierres",
          "Takchita du henné : bijoux traditionnels dorés",
          "Robe de soirée : bijoux minimalistes modernes",
        ],
      },
      {
        heading: 'Cadeaux bijoux pour invités',
        paragraphs: [
          "Tradition marocaine : offrir petits cadeaux aux invitées proches. Options populaires :",
        ],
        list: [
          "Bracelets fins argent — 150 à 250 DH (adapté à toutes)",
          "Boucles d'oreilles simples — 100 à 200 DH",
          "Colliers khamsa mini — 180 à 300 DH",
          "Packs coordinated — parure symbolique 200-350 DH",
        ],
      },
      {
        heading: 'Où acheter ses bijoux de mariage au Maroc ?',
        paragraphs: [
          "3 options principales, chacune 3endha ses avantages :",
        ],
        list: [
          "Souks traditionnels (Rabat médina, Fes, Marrakech) : authentique, mais négociation obligatoire",
          "Bijouteries physiques modernes : garantie certifiée, prix plus élevés",
          "Boutiques en ligne (comme Elarain) : livraison rapide, prix compétitifs, essai à domicile",
        ],
      },
      {
        heading: 'Calendrier : quand commander ?',
        paragraphs: [
          "Bijoux mariée principaux : 2-3 mois avant. Cadeaux invités : 1 mois avant. Ma tkhalich l'dernière semaine parce que ghadi tstress bezaf.",
        ],
      },
    ],
    cta: "Elarain propose des packs bijoux mariage sur mesure : parures complètes assorties, cadeaux pour invitées, livraison Maroc 24-48h. Contact WhatsApp +212 693-011454 pour un devis personnalisé.",
  },

  {
    slug: 'comment-choisir-taille-bracelet-bague-femme',
    title: 'Comment choisir la bonne taille de bracelet et bague pour femme',
    seoTitle: 'Taille bracelet et bague femme : le guide simple pour ne pas se tromper',
    description: "Kifach ta3ref taille de bague ou bracelet à offrir bla ma tsawel la personne ? Voici techniques simples : ficelle, papier, comparaison. Guide 2026.",
    publishedAt: '2026-01-02',
    updatedAt: '2026-01-02',
    category: 'Guide d\'achat',
    readingMinutes: 4,
    keywords: ['taille bague femme', 'comment mesurer bague', 'taille bracelet femme', 'cadeau bijou taille', 'guide taille bijoux'],
    hero: LOGO,
    intro: "Cadeau bijou zwin, mais problème : ghadi ykon la taille ? Wach ghadi ykhss ? Wach ghadi ykbr ? Fhad la maquette, ghadi te3ref exactement kifach tekhtar la bonne taille sans avoir à mesurer directement.",
    sections: [
      {
        heading: 'Pour une bague',
        paragraphs: [
          "Le plus simple : sri9 f discret une bague qu'elle porte souvent, mesure son diamètre intérieur avec une règle. Consulte notre tableau :",
        ],
        list: [
          "15.7 mm = taille 49 (petite)",
          "16.5 mm = taille 52 (moyenne)",
          "17.3 mm = taille 54 (moyenne+)",
          "18.1 mm = taille 57 (grande)",
          "18.8 mm = taille 59 (très grande)",
        ],
      },
      {
        heading: 'Alternative : la méthode ficelle',
        paragraphs: [
          "Enroule une ficelle autour de son doigt (celui du milieu généralement, ou l'annulaire pour alliance). Marque avec un stylo, puis mesure la longueur en mm. Divise par π (3.14) = diamètre intérieur.",
        ],
      },
      {
        heading: 'Pour un bracelet',
        paragraphs: [
          "Mesure son poignet le plus fin avec un mètre couture. Ajoute :",
        ],
        list: [
          "+1 cm pour bracelet ajusté (près du poignet)",
          "+2 cm pour bracelet classique (peu de mouvement)",
          "+3 cm pour bracelet coulant (bougie librement)",
        ],
      },
      {
        heading: 'Astuce : les tailles standard',
        paragraphs: [
          "Ma tal9aich sa taille exacte ? Kayn deux tailles standard qui couvrent 80% des femmes :",
        ],
        list: [
          "Bague : taille 54 (moyenne)",
          "Bracelet femme : 17-18 cm de circonférence",
        ],
      },
      {
        heading: 'Si tu te trompes, tu peux échanger !',
        paragraphs: [
          "Chez Elarain, on te permet d'échanger la taille gratuitement dans les 7 jours après réception. Ne stresse pas si tu n'es pas sûr — commande, et on ajuste après.",
        ],
      },
    ],
    cta: "Toutes les bagues et bracelets Elarain sont livrés avec un guide de tailles imprimé. Échange gratuit dans 7 jours si la taille ne convient pas. Livraison Maroc 24-48h.",
  },
]

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export function getAllSlugs(): string[] {
  return articles.map(a => a.slug)
}
