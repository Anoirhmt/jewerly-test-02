import { NextResponse } from 'next/server'

const VPS = 'http://195.201.96.39:5000'
const AUTH = 'Basic ' + Buffer.from(':elarain123').toString('base64')

export const dynamic = 'force-dynamic'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const res = await fetch(`${VPS}/admin/orders/edit/${encodeURIComponent(id)}`, {
      method: 'POST',
      headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return NextResponse.json(await res.json(), { status: res.status })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
