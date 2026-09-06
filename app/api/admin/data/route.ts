import { NextResponse } from 'next/server'

const VPS = 'http://195.201.96.39:5000'
const AUTH = 'Basic ' + Buffer.from(':elarain123').toString('base64')

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await fetch(`${VPS}/admin/data`, {
      cache: 'no-store',
      headers: { Authorization: AUTH },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ rows: [], error: String(e) }, { status: 500 })
  }
}
