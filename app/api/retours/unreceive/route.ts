import { NextResponse } from 'next/server'
import { requireAdmin, vpsAuth } from '@/lib/admin-session'

const VPS = 'http://195.201.96.39:5000'

export async function POST(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  try {
    const body = await req.json()
    await fetch(`${VPS}/api/unreceive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: vpsAuth() },
      body: JSON.stringify(body),
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
