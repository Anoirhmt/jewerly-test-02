import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from '@/lib/admin-session'

// The password is never in the code. ADMIN_PASSWORD_HASH (Vercel environment variable) holds
// "pbkdf2$<iterations>$<salt hex>$<hash hex>" — a salted PBKDF2-SHA256 hash of it.
async function passwordMatches(password: string): Promise<boolean | null> {
  const [algo, iter, salt, hash] = (process.env.ADMIN_PASSWORD_HASH || '').split('$')
  if (algo !== 'pbkdf2' || !Number(iter) || !salt || !hash) return null // not configured
  const expected = Buffer.from(hash, 'hex')
  const actual = await new Promise<Buffer>((resolve, reject) =>
    crypto.pbkdf2(password, Buffer.from(salt, 'hex'), Number(iter), expected.length, 'sha256',
      (err, key) => (err ? reject(err) : resolve(key))))
  return crypto.timingSafeEqual(actual, expected)
}

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

  const matches = await passwordMatches(body.password || '')
  const token = matches ? await createSessionToken() : null
  if (matches === null || (matches && !token)) {
    console.error('[login] ADMIN_PASSWORD_HASH or ADMIN_SESSION_SECRET is missing in the environment')
    return NextResponse.json({ success: false, error: 'not configured' }, { status: 500 })
  }

  if (matches && token) {
    // Reset attempts on success
    attempts.delete(ip)

    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_MAX_AGE,
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
