import { NextResponse } from 'next/server'
import { requireAdmin, vpsAuth } from '@/lib/admin-session'

const VPS = 'http://195.201.96.39:5000'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  const url = new URL(req.url)
  const source = url.searchParams.get('source') || 'website'
  try {
    const res = await fetch(`${VPS}/admin/orders/data?source=${encodeURIComponent(source)}`, {
      cache: 'no-store',
      headers: { Authorization: vpsAuth() },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ rows: [], error: String(e) }, { status: 500 })
  }
}
