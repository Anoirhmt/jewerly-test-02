import { NextResponse } from 'next/server'

const VPS = 'http://195.201.96.39:5000'
const AUTH = 'Basic ' + Buffer.from(':elarain123').toString('base64')

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const res = await fetch(`${VPS}/admin/orders/pdf/${encodeURIComponent(id)}`, {
      cache: 'no-store',
      headers: { Authorization: AUTH },
    })
    const buf = await res.arrayBuffer()
    return new NextResponse(buf, {
      status: res.status,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="riyalto_${id}.pdf"`,
      },
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
