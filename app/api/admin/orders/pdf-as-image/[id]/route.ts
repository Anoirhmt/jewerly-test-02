import { NextResponse } from 'next/server'

const VPS = 'http://195.201.96.39:5000'
const AUTH = 'Basic ' + Buffer.from(':elarain123').toString('base64')

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const url = new URL(req.url)
  const fmt = url.searchParams.get('format') || '10x10'
  try {
    const res = await fetch(`${VPS}/admin/orders/pdf-as-image/${encodeURIComponent(id)}?format=${fmt}`, {
      cache: 'no-store',
      headers: { Authorization: AUTH },
    })
    const buf = await res.arrayBuffer()
    return new NextResponse(buf, {
      status: res.status,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="label_${id}.png"`,
      },
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
