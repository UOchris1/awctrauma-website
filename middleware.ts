import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isAdminApi = request.nextUrl.pathname.startsWith('/api/admin')

  if (isAdminPage || isAdminApi) {
    const authCookie = request.cookies.get('admin-auth')
    
    if (!authCookie || authCookie.value !== 'true') {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
