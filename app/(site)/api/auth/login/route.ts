import { NextResponse } from 'next/server'
import crypto from 'crypto'

// SHA-256 hash of the password — plaintext never stored anywhere in code
const PASSWORD_HASH = 'da71fbc643b173696fe608a95902017c74e9f191bc5eaa16b01d0409b2ec187a'

// Server-side rate limiting (per IP)
const attempts = new Map<string, { count: number; lockedUntil: number }>()

const MAX_ATTEMPTS = 3
const LOCKOUT_MS = 5 * 60 * 1000 // 5 minutes

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

  // Check rate limit
  const record = attempts.get(ip) || { count: 0, lockedUntil: 0 }
  if (Date.now() < record.lockedUntil) {
    const secondsLeft = Math.ceil((record.lockedUntil - Date.now()) / 1000)
    return NextResponse.json({ success: false, locked: true, secondsLeft }, { status: 429 })
  }

  // Add artificial delay to slow brute force
  await new Promise(r => setTimeout(r, 800))

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const hash = crypto.createHash('sha256').update(body.password || '').digest('hex')

  if (hash === PASSWORD_HASH) {
    // Reset attempts on success
    attempts.delete(ip)

    const response = NextResponse.json({ success: true })
    response.cookies.set('__admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    })
    return response
  }

  // Wrong password — increment attempts
  const newCount = record.count + 1
  const locked = newCount >= MAX_ATTEMPTS
  attempts.set(ip, {
    count: locked ? 0 : newCount,
    lockedUntil: locked ? Date.now() + LOCKOUT_MS : 0,
  })

  return NextResponse.json({
    success: false,
    locked,
    attemptsLeft: locked ? 0 : MAX_ATTEMPTS - newCount,
    secondsLeft: locked ? LOCKOUT_MS / 1000 : 0,
  }, { status: 401 })
}
