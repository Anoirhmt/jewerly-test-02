import { NextResponse } from 'next/server'

const VPS = 'http://178.105.60.185:5000'

export async function GET() {
  try {
    const res = await fetch(`${VPS}/api/orders`, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ orders: [], error: String(e) })
  }
}
