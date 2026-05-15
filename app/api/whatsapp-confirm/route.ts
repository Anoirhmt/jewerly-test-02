import { NextResponse } from 'next/server'

const VPS = 'https://assuming-cas-casting-promise.trycloudflare.com'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${VPS}/api/order-confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json({ ok: true, ...data })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
