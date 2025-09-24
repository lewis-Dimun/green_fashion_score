import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequestWithAuth } from 'next-auth/middleware'

const ADMIN_ROLE = 'ADMIN'
const USER_ROLE = 'USER'
const DASHBOARD_ROLES = new Set([ADMIN_ROLE, USER_ROLE])
const ADMIN_API_PREFIXES = ['/api/pillars', '/api/questions', '/api/options', '/api/results']
const USER_API_PREFIXES = ['/api/survey', '/api/results/me']

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl
    const role = typeof token?.role === 'string' ? token.role.toUpperCase() : undefined
    const isApiRoute = pathname.startsWith('/api/')
    const isAdminApi = ADMIN_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
    const isUserApi = USER_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))

    if (!token) {
      if (isApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    if (pathname.startsWith('/dashboard') && (!role || !DASHBOARD_ROLES.has(role))) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (pathname.startsWith('/survey') && role !== USER_ROLE) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }


    if (isAdminApi && role !== ADMIN_ROLE) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (isUserApi && role !== USER_ROLE) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/survey/:path*',
    '/api/pillars/:path*',
    '/api/questions/:path*',
    '/api/options/:path*',
    '/api/results/:path*',
    '/api/results/me',
    '/api/survey/:path*',
  ],
}
