import { NextRequest, NextResponse } from 'next/server'

const VPS = 'http://178.105.60.185:5000'

// GET: webhook verification challenge from Meta
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  try {
    // Forward to Flask which handles verification
    const vpsUrl = `${VPS}/webhook/whatsapp?hub.mode=${mode}&hub.verify_token=${token}&hub.challenge=${challenge}`
    const res = await fetch(vpsUrl, { cache: 'no-store' })
    const text = await res.text()
    return new NextResponse(text, { status: res.status })
  } catch {
    return new NextResponse('error', { status: 500 })
  }
}

// POST: incoming webhook events from Meta (customer replies, delivery status)
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const res = await fetch(`${VPS}/webhook/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    })
    const text = await res.text()
    return new NextResponse(text, { status: res.status })
  } catch {
    return new NextResponse('error', { status: 500 })
  }
}

export const maxDuration = 30
