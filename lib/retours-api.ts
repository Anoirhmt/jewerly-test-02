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
