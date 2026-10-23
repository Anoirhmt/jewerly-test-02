import { NextResponse } from 'next/server'
import { requireAdmin, vpsAuth } from '@/lib/admin-session'

const VPS = 'http://195.201.96.39:5000'

export const dynamic = 'force-dynamic'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  const { id } = await params
  try {
    const body = await req.json()
    const res = await fetch(`${VPS}/admin/orders/edit/${encodeURIComponent(id)}`, {
      method: 'POST',
      headers: { Authorization: vpsAuth(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return NextResponse.json(await res.json(), { status: res.status })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
