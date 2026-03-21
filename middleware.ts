import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/studio') && pathname !== '/studio/login') {
    const auth = request.cookies.get('studio-auth')
    if (auth?.value !== process.env.STUDIO_PASSWORD) {
      return NextResponse.redirect(new URL('/studio/login', request.url))
    }
  }
}

export const config = {
  matcher: ['/studio/:path*']
}
