import type { Order, Return, CreateShipmentData, ReturnStatus } from '@/types/admin'

// TODO: Add Riyaltoexpress API base URL when you receive the documentation
const API_BASE = ''

const getHeaders = () => ({
  'Content-Type': 'application/json',
  // TODO: Add your API key to .env.local as NEXT_PUBLIC_RIYALTO_API_KEY
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RIYALTO_API_KEY || ''}`,
})

// --- Mock data (replace with real API calls once you have the docs) ---

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    trackingNumber: 'RYL20240001',
    customerName: 'Fatima Zahra Alaoui',
    customerPhone: '0612345678',
    address: '12 Rue Hassan II',
    city: 'Casablanca',
    items: 'Bracelet or x1',
    total: 250,
    status: 'delivered',
    source: 'website',
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: '2',
    trackingNumber: 'RYL20240002',
    customerName: 'Nadia Benali',
    customerPhone: '0698765432',
    address: '45 Avenue Mohammed V',
    city: 'Rabat',
    items: "Collier argent x1, Boucles d'oreilles x2",
    total: 480,
    status: 'in_transit',
    source: 'whatsapp',
    createdAt: '2024-12-05T14:30:00Z',
  },
  {
    id: '3',
    trackingNumber: 'RYL20240003',
    customerName: 'Houda Mansouri',
    customerPhone: '0654321098',
    address: '8 Rue Ibnou Sina',
    city: 'Marrakech',
    items: 'Bague diamant x1',
    total: 890,
    status: 'returned',
    source: 'tiktok',
    createdAt: '2024-12-08T09:15:00Z',
  },
  {
    id: '4',
    trackingNumber: 'RYL20240004',
    customerName: 'Karima Idrissi',
    customerPhone: '0677889900',
    address: '23 Boulevard Zerktouni',
    city: 'Fès',
    items: 'Pendentif or x1',
    total: 320,
    status: 'pending',
    source: 'whatsapp',
    createdAt: '2024-12-10T11:45:00Z',
  },
  {
    id: '5',
    trackingNumber: 'RYL20240005',
    customerName: 'Samira Ouali',
    customerPhone: '0633445566',
    address: '67 Rue Allal Ben Abdallah',
    city: 'Tanger',
    items: 'Bracelet argent x2',
    total: 180,
    status: 'delivered',
    source: 'website',
    createdAt: '2024-12-12T16:20:00Z',
  },
  {
    id: '6',
    trackingNumber: 'RYL20240006',
    customerName: 'Yasmine Tazi',
    customerPhone: '0611223344',
    address: '14 Rue Ibn Toumert',
    city: 'Agadir',
    items: 'Collier or x1',
    total: 410,
    status: 'delivered',
    source: 'tiktok',
    createdAt: '2024-12-09T13:00:00Z',
  },
  {
    id: '7',
    trackingNumber: 'RYL20240007',
    customerName: 'Layla Berrada',
    customerPhone: '0655667788',
    address: '3 Avenue des FAR',
    city: 'Oujda',
    items: "Boucles d'oreilles x3",
    total: 270,
    status: 'returned',
    source: 'whatsapp',
    createdAt: '2024-12-14T08:30:00Z',
  },
  {
    id: '8',
    trackingNumber: 'RYL20240008',
    customerName: 'Zineb Cherkaoui',
    customerPhone: '0622334455',
    address: '88 Rue de la Liberté',
    city: 'Meknès',
    items: 'Montre femme x1, Bracelet x1',
    total: 750,
    status: 'picked_up',
    source: 'website',
    createdAt: '2024-12-15T10:00:00Z',
  },
  {
    id: '9',
    trackingNumber: 'RYL20240009',
    customerName: 'Meriem Khaldi',
    customerPhone: '0644556677',
    address: '5 Rue Moulay Rachid',
    city: 'Tétouan',
    items: 'Sac à main x1',
    total: 1100,
    status: 'in_transit',
    source: 'tiktok',
    createdAt: '2024-12-16T09:45:00Z',
  },
  {
    id: '10',
    trackingNumber: 'RYL20240010',
    customerName: 'Hajar Fennich',
    customerPhone: '0666778899',
    address: '19 Boulevard Pasteur',
    city: 'Casablanca',
    items: 'Parfum x2',
    total: 560,
    status: 'delivered',
    source: 'whatsapp',
    createdAt: '2024-12-17T14:10:00Z',
  },
  {
    id: '11',
    trackingNumber: 'RYL20240011',
    customerName: 'Imane Bouazza',
    customerPhone: '0688990011',
    address: '31 Rue Imam Malik',
    city: 'Kénitra',
    items: 'Robe soirée x1',
    total: 390,
    status: 'pending',
    source: 'tiktok',
    createdAt: '2024-12-18T11:00:00Z',
  },
  {
    id: '12',
    trackingNumber: 'RYL20240012',
    customerName: 'Souad Lamrani',
    customerPhone: '0699001122',
    address: '77 Avenue Hassan II',
    city: 'Rabat',
    items: 'Chaussures x1, Ceinture x1',
    total: 680,
    status: 'cancelled',
    source: 'website',
    createdAt: '2024-12-19T08:00:00Z',
  },
  {
    id: '13',
    trackingNumber: 'RYL20240013',
    customerName: 'Amina Ouazzani',
    customerPhone: '0611334455',
    address: '9 Rue Bab Doukkala',
    city: 'Marrakech',
    items: 'Djellaba x1',
    total: 1200,
    status: 'delivered',
    source: 'whatsapp',
    createdAt: '2024-12-20T13:30:00Z',
  },
  {
    id: '14',
    trackingNumber: 'RYL20240014',
    customerName: 'Rania Sqalli',
    customerPhone: '0622445566',
    address: '42 Rue Mohammed Beqal',
    city: 'Fès',
    items: 'Caftan x1, Accessoires x2',
    total: 940,
    status: 'in_transit',
    source: 'tiktok',
    createdAt: '2024-12-21T10:15:00Z',
  },
  {
    id: '15',
    trackingNumber: 'RYL20240015',
    customerName: 'Khadija Elhaddad',
    customerPhone: '0633556677',
    address: '56 Avenue Moulay Ismail',
    city: 'Beni Mellal',
    items: 'Huile argan x3, Savon x2',
    total: 145,
    status: 'pending',
    source: 'whatsapp',
    createdAt: '2024-12-22T09:00:00Z',
  },
]

const MOCK_RETURNS: Return[] = [
  {
    id: 'r1',
    orderId: '3',
    trackingNumber: 'RYL20240003',
    scannedCode: 'MA82042A3001',
    customerName: 'Houda Mansouri',
    customerPhone: '0654321098',
    city: 'Marrakech',
    items: 'Bague diamant x1',
    total: 890,
    returnStatus: 'en_attente',
    createdAt: '2024-12-11T09:00:00Z',
    reason: 'Client absent',
  },
  {
    id: 'r2',
    orderId: '6',
    trackingNumber: 'RYL20240006',
    scannedCode: 'MA82042B4012',
    customerName: 'Yasmine Tazi',
    customerPhone: '0611223344',
    city: 'Agadir',
    items: 'Collier or x1',
    total: 410,
    returnStatus: 'recu',
    createdAt: '2024-12-09T13:00:00Z',
    receivedAt: '2024-12-13T10:00:00Z',
    reason: 'Refus de livraison',
  },
  {
    id: 'r3',
    orderId: '7',
    trackingNumber: 'RYL20240007',
    scannedCode: 'MA82042C5023',
    customerName: 'Layla Berrada',
    customerPhone: '0655667788',
    city: 'Oujda',
    items: "Boucles d'oreilles x3",
    total: 270,
    returnStatus: 'en_transit_retour',
    createdAt: '2024-12-14T08:30:00Z',
    reason: 'Adresse incorrecte',
  },
  {
    id: 'r4',
    orderId: '12',
    trackingNumber: 'RYL20240012',
    scannedCode: 'MA82042D6034',
    customerName: 'Souad Lamrani',
    customerPhone: '0699001122',
    city: 'Rabat',
    items: 'Chaussures x1, Ceinture x1',
    total: 680,
    returnStatus: 'recu',
    createdAt: '2024-12-19T08:00:00Z',
    receivedAt: '2024-12-22T14:00:00Z',
    reason: 'Commande annulée',
  },
  {
    id: 'r5',
    orderId: '4',
    trackingNumber: 'RYL20240004',
    scannedCode: 'MA82042E7045',
    customerName: 'Karima Idrissi',
    customerPhone: '0677889900',
    city: 'Fès',
    items: 'Pendentif or x1',
    total: 320,
    returnStatus: 'non_recu',
    createdAt: '2024-12-12T11:00:00Z',
    reason: 'Colis perdu en transit',
  },
  {
    id: 'r6',
    orderId: '9',
    trackingNumber: 'RYL20240009',
    scannedCode: 'MA82042F8056',
    customerName: 'Meriem Khaldi',
    customerPhone: '0644556677',
    city: 'Tétouan',
    items: 'Sac à main x1',
    total: 1100,
    returnStatus: 'en_attente',
    createdAt: '2024-12-18T09:00:00Z',
    reason: 'Produit non conforme',
  },
  {
    id: 'r7',
    orderId: '2',
    trackingNumber: 'RYL20240002',
    scannedCode: 'MA82042G9067',
    customerName: 'Nadia Benali',
    customerPhone: '0698765432',
    city: 'Rabat',
    items: "Collier argent x1, Boucles d'oreilles x2",
    total: 480,
    returnStatus: 'recu',
    createdAt: '2024-12-07T14:00:00Z',
    receivedAt: '2024-12-10T11:00:00Z',
    reason: 'Client a changé d\'avis',
  },
  {
    id: 'r8',
    orderId: '14',
    trackingNumber: 'RYL20240014',
    scannedCode: 'MA82042H0078',
    customerName: 'Rania Sqalli',
    customerPhone: '0622445566',
    city: 'Fès',
    items: 'Caftan x1, Accessoires x2',
    total: 940,
    returnStatus: 'en_transit_retour',
    createdAt: '2024-12-23T10:00:00Z',
    reason: 'Taille incorrecte',
  },
]

// --- localStorage helpers for manually created orders ---

function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('admin_orders')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveLocalOrders(orders: Order[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('admin_orders', JSON.stringify(orders))
}

// --- API functions ---

export async function getOrders(): Promise<Order[]> {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/orders`, { headers: getHeaders() })
  // return res.json()
  const local = getLocalOrders()
  return [...local, ...MOCK_ORDERS]
}

export async function createShipment(data: CreateShipmentData): Promise<Order> {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/shipments`, {
  //   method: 'POST',
  //   headers: getHeaders(),
  //   body: JSON.stringify(data),
  // })
  // return res.json()
  const newOrder: Order = {
    id: `local_${Date.now()}`,
    trackingNumber: `RYL${Date.now()}`,
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  const local = getLocalOrders()
  saveLocalOrders([newOrder, ...local])
  return newOrder
}

export async function getReturns(): Promise<Return[]> {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/returns`, { headers: getHeaders() })
  // return res.json()
  return [...MOCK_RETURNS]
}

export async function updateReturnStatus(returnId: string, status: ReturnStatus): Promise<void> {
  // TODO: Replace with real API call
  // await fetch(`${API_BASE}/returns/${returnId}`, {
  //   method: 'PATCH',
  //   headers: getHeaders(),
  //   body: JSON.stringify({ status }),
  // })
  const idx = MOCK_RETURNS.findIndex(r => r.id === returnId)
  if (idx !== -1) {
    MOCK_RETURNS[idx].returnStatus = status
    if (status === 'recu') {
      MOCK_RETURNS[idx].receivedAt = new Date().toISOString()
    }
  }
}
