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

const VPS = 'http://178.105.60.185:5000'

export async function getRetourOrders(): Promise<{ orders: RiyaltoOrder[]; error: string | null }> {
  try {
    const res = await fetch(`${VPS}/api/orders`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    return { orders: [], error: String(e) }
  }
}

export async function receiveOrder(riya: string): Promise<void> {
  await fetch(`${VPS}/api/receive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ riya }),
  })
}

export async function unreceiveOrder(riya: string): Promise<void> {
  await fetch(`${VPS}/api/unreceive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ riya }),
  })
}
