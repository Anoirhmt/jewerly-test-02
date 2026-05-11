export interface RiyaltoOrder {
  riya: string
  name: string
  phone: string
  price: string
  state: string
  city: string
  date: string
  archived: boolean
  received: boolean
  date_recu: string
}

export async function getRetourOrders(): Promise<{ orders: RiyaltoOrder[]; error: string | null }> {
  try {
    const res = await fetch('/api/retours/orders', { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    return { orders: [], error: String(e) }
  }
}

export async function receiveOrder(riya: string): Promise<void> {
  await fetch('/api/retours/receive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ riya }),
  })
}

export async function unreceiveOrder(riya: string): Promise<void> {
  await fetch('/api/retours/unreceive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ riya }),
  })
}

export interface AllOrders {
  encours: RiyaltoOrderLight[]
  delivered: RiyaltoOrderLight[]
  failed: RiyaltoOrderLight[]
  error: string | null
}

export interface RiyaltoOrderLight {
  riya: string
  name: string
  phone: string
  price: string
  state: string
  city: string
  date: string
}

async function fetchOrderType(type: 'encours' | 'delivered' | 'failed'): Promise<RiyaltoOrderLight[]> {
  try {
    const res = await fetch(`/api/retours/${type}`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return data.orders ?? []
  } catch {
    return []
  }
}

export async function getAllOrders(): Promise<AllOrders> {
  try {
    const [encours, delivered, failed] = await Promise.all([
      fetchOrderType('encours'),
      fetchOrderType('delivered'),
      fetchOrderType('failed'),
    ])
    return { encours, delivered, failed, error: null }
  } catch (e) {
    return { encours: [], delivered: [], failed: [], error: String(e) }
  }
}
