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
    hostname: request.nextUrl.hostname 
  })

  // Redirect logic
  if (isPublicPath && hasSession) {
    console.log('✅ Has session, redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicPath && !hasSession) {
    console.log('🔒 No session, redirecting to login')
    return NextResponse.redirect(new URL('/', request.url))
  }

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