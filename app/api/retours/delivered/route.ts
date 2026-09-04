import { NextResponse } from 'next/server'

const VPS = 'http://195.201.96.39:5000'

export const maxDuration = 60

export async function GET() {
  try {
    const res = await fetch(`${VPS}/api/delivered`, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ orders: [], error: String(e) })
  }
}
