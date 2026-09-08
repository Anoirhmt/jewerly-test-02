import { NextResponse } from 'next/server'

const VPS = 'http://195.201.96.39:5000'
const AUTH = 'Basic ' + Buffer.from(':elarain123').toString('base64')

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    await fetch(`${VPS}/admin/toggle-site-editor`, {
      method: 'POST',
      headers: { Authorization: AUTH },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
