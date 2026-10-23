// Dashboard (/anoir) login session: a signed, expiring token in the __admin_session cookie.
// Token = "<expiry ms>.<random>.<HMAC-SHA256 signature>", signed with ADMIN_SESSION_SECRET
// (a Vercel environment variable). Changing that secret logs everyone out.
// Uses Web Crypto only, so it also runs in middleware (Edge runtime).

export const SESSION_COOKIE = "__admin_session"
export const SESSION_MAX_AGE = 60 * 60 * 8 // 8 hours, in seconds

const enc = new TextEncoder()

function b64url(bytes: Uint8Array): string {
  let s = ""
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromB64url(s: string): Uint8Array | null {
  try {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"))
    return Uint8Array.from(bin, c => c.charCodeAt(0))
  } catch {
    return null
  }
}

async function hmacKey(): Promise<CryptoKey | null> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) return null // not configured: nobody gets in
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"])
}

export async function createSessionToken(): Promise<string | null> {
  const key = await hmacKey()
  if (!key) return null
  const payload = `${Date.now() + SESSION_MAX_AGE * 1000}.${b64url(crypto.getRandomValues(new Uint8Array(16)))}`
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(payload)))
  return `${payload}.${b64url(sig)}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [exp, nonce, sigText] = parts
  if (!/^\d{1,16}$/.test(exp) || Number(exp) < Date.now()) return false
  const sig = fromB64url(sigText)
  const key = await hmacKey()
  if (!sig || !key) return false
  return crypto.subtle.verify("HMAC", key, sig.buffer as ArrayBuffer, enc.encode(`${exp}.${nonce}`))
}

function cookieFrom(req: Request): string | undefined {
  const header = req.headers.get("cookie") || ""
  for (const part of header.split(";")) {
    const i = part.indexOf("=")
    if (i > 0 && part.slice(0, i).trim() === SESSION_COOKIE) return decodeURIComponent(part.slice(i + 1).trim())
  }
  return undefined
}

// For API routes: returns a 401 response when the caller is not logged in, otherwise null.
export async function requireAdmin(req: Request): Promise<Response | null> {
  if (await verifySessionToken(cookieFrom(req))) return null
  return Response.json({ ok: false, error: "unauthorized" }, { status: 401 })
}

// Basic-auth header the Flask app on the VPS expects (password in the VPS_ADMIN_PASSWORD env var).
export function vpsAuth(): string {
  return "Basic " + btoa(":" + (process.env.VPS_ADMIN_PASSWORD || ""))
}
