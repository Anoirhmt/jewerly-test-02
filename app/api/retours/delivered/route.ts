import { NextResponse } from 'next/server'
import { requireAdmin, vpsAuth } from '@/lib/admin-session'

const VPS = 'http://195.201.96.39:5000'

export const maxDuration = 60

export async function GET(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  try {
    const res = await fetch(`${VPS}/api/delivered`, { cache: 'no-store', headers: { Authorization: vpsAuth() } })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ orders: [], error: String(e) })
  }
}
