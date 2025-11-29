import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/'

  // Get project ID from env
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6925f7e8003628848504'

  // Check for session cookies
  const cookies = request.cookies.getAll()
  const sessionCookie = cookies.find(cookie => 
    cookie.name === `a_session_${projectId}` ||
    cookie.name === `a_session_${projectId}_legacy`
  )

  const hasSession = sessionCookie && sessionCookie.value && sessionCookie.value.length > 0

  console.log('🔒 Middleware:', { 
    path, 
    hasSession,
    isPublicPath,
    cookieNames: cookies.map(c => c.name)
  })

  // FIXED: Prevent redirect loops
  // Only redirect if we're NOT already on the target page
  if (isPublicPath && hasSession) {
    // User has session but is on login page - redirect to dashboard
    console.log('✅ Redirecting authenticated user from / to /dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicPath && !hasSession) {
    // User has no session but trying to access protected route - redirect to login
    console.log('🔒 Redirecting unauthenticated user from', path, 'to /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // All checks passed - allow request
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/invoices/:path*',
    '/transactions/:path*',
    '/wallets/:path*',
    '/settings/:path*',
    '/help/:path*'
  ]
}