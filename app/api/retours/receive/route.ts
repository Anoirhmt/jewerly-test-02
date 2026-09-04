import { NextResponse } from 'next/server'

const VPS = 'http://195.201.96.39:5000'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await fetch(`${VPS}/api/receive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
