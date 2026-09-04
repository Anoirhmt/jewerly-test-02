import { NextResponse } from 'next/server'

const VPS = 'http://195.201.96.39:5000'

export const maxDuration = 30

export async function GET() {
  try {
    const res = await fetch(`${VPS}/api/encours`, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ orders: [], error: String(e) })
  }
}
