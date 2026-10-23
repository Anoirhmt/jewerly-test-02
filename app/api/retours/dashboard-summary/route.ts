import { NextResponse } from 'next/server'
import { requireAdmin, vpsAuth } from '@/lib/admin-session'

const VPS = 'http://195.201.96.39:5000'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  try {
    const res = await fetch(`${VPS}/api/dashboard-summary`, { cache: 'no-store', headers: { Authorization: vpsAuth() } })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({
      encours_count: 0, delivered_count: 0, failed_count: 0,
      revenue: 0, recent_encours: [], error: String(e),
    }, { status: 500 })
  }
}
