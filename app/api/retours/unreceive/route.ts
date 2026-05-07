import { NextResponse } from 'next/server'

const VPS = 'http://178.105.60.185:5000'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await fetch(`${VPS}/api/unreceive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
