import { NextResponse } from 'next/server'
import { requireAdmin, vpsAuth } from '@/lib/admin-session'
import { PACKS_VPS as VPS } from '@/lib/packs'

// Screenshot of a chat → the order details in it (read on the VPS by Gemini; the image is not stored).

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  try {
    const res = await fetch(`${VPS}/admin/orders/extract`, {
      method: 'POST',
      headers: { Authorization: vpsAuth(), 'Content-Type': 'application/json' },
      body: JSON.stringify(await req.json()),
      cache: 'no-store',
      signal: AbortSignal.timeout(55000),
    })
    return NextResponse.json(await res.json(), { status: res.status })
  } catch {
    return NextResponse.json({ ok: false, error: 'vps' }, { status: 502 })
  }
}
