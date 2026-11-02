import { NextResponse } from 'next/server'
import { requireAdmin, vpsAuth } from '@/lib/admin-session'
import { PACKS_VPS as VPS } from '@/lib/packs'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  try {
    const res = await fetch(`${VPS}/admin/orders/create`, {
      method: 'POST',
      headers: { Authorization: vpsAuth(), 'Content-Type': 'application/json' },
      body: JSON.stringify(await req.json()),
      cache: 'no-store',
    })
    return NextResponse.json(await res.json(), { status: res.status })
  } catch {
    return NextResponse.json({ ok: false, error: 'vps' }, { status: 502 })
  }
}
