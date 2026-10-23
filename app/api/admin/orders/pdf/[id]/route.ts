import { NextResponse } from 'next/server'
import { requireAdmin, vpsAuth } from '@/lib/admin-session'

const VPS = 'http://195.201.96.39:5000'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  const { id } = await params
  const url = new URL(req.url)
  const fmt = url.searchParams.get('format') || '10x10'
  try {
    const res = await fetch(`${VPS}/admin/orders/pdf/${encodeURIComponent(id)}?format=${fmt}`, {
      cache: 'no-store',
      headers: { Authorization: vpsAuth() },
    })
    const buf = await res.arrayBuffer()
    return new NextResponse(buf, {
      status: res.status,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="riyalto_${id}_${fmt}.pdf"`,
      },
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
