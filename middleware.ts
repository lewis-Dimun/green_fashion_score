import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_ROLE = 'ADMIN'
const USER_ROLE = 'USER'

export default withAuth(
  function middleware(req: NextRequest) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl
    const role = typeof token?.role === 'string' ? token.role.toUpperCase() : undefined

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    if (pathname.startsWith('/dashboard') && role !== ADMIN_ROLE) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (pathname.startsWith('/survey') && role !== USER_ROLE) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/survey/:path*'],
}
