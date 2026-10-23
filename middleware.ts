import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Packs & prix has its own code, checked by the VPS on every save
  if (pathname.startsWith('/api/admin/packs')) return NextResponse.next()

  // The login page itself stays open
  if (pathname === '/anoir') return NextResponse.next()

  if (await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next()

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  return NextResponse.redirect(new URL('/anoir', request.url))
}

export const config = {
  matcher: ['/anoir/:path*', '/api/admin/:path*', '/api/retours/:path*'],
}
