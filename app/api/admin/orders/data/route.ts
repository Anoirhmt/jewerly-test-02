import { NextResponse } from 'next/server'

const VPS = 'http://195.201.96.39:5000'
const AUTH = 'Basic ' + Buffer.from(':elarain123').toString('base64')

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const source = url.searchParams.get('source') || 'website'
  try {
    const res = await fetch(`${VPS}/admin/orders/data?source=${encodeURIComponent(source)}`, {
      cache: 'no-store',
      headers: { Authorization: AUTH },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ rows: [], error: String(e) }, { status: 500 })
  }
}
