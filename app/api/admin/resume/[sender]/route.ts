import { NextResponse } from 'next/server'
import { requireAdmin, vpsAuth } from '@/lib/admin-session'

const VPS = 'http://195.201.96.39:5000'

export const dynamic = 'force-dynamic'

export async function POST(req: Request, { params }: { params: Promise<{ sender: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  const { sender } = await params
  try {
    await fetch(`${VPS}/admin/resume/${encodeURIComponent(sender)}`, {
      method: 'POST',
      headers: { Authorization: vpsAuth() },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
