import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /anoir pages except the login page itself
  if (pathname.startsWith('/anoir') && pathname !== '/anoir') {
    const session = request.cookies.get('__admin_session')
    if (!session || session.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/anoir', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/anoir/:path*'],
}
