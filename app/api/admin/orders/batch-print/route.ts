import { NextResponse } from 'next/server'

const VPS = 'http://195.201.96.39:5000'
const AUTH = 'Basic ' + Buffer.from(':elarain123').toString('base64')

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${VPS}/admin/orders/batch-print`, {
      method: 'POST',
      headers: {
        Authorization: AUTH,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const txt = await res.text()
      return NextResponse.json({ error: txt || 'failed' }, { status: res.status })
    }
    const buf = await res.arrayBuffer()
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="riyalto_batch.pdf"`,
        'X-Order-Count': res.headers.get('X-Order-Count') || '',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
