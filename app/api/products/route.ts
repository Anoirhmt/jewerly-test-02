import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.GOOGLE_SHEET_API_URL
  if (!url) {
    return NextResponse.json({ error: 'Missing Google Sheet URL' }, { status: 500 })
  }

  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) {
      return NextResponse.json({ error: `Google Sheet error: ${res.status}` }, { status: 500 })
    }
    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}