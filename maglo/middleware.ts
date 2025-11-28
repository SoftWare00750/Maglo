import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/'

  // Get project ID from env
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  
  // If no project ID, allow access (fail open for debugging)
  if (!projectId) {
    console.error('⚠️ Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID')
    return NextResponse.next()
  }

  // Check for session cookies
  const cookies = request.cookies.getAll()
  const sessionCookie = cookies.find(cookie => 
    cookie.name === `a_session_${projectId}` ||
    cookie.name === `a_session_${projectId}_legacy`
  )

  const hasSession = sessionCookie && sessionCookie.value && sessionCookie.value.length > 0

  console.log('🔒 Middleware:', { path, hasSession, projectId })

  if (isPublicPath && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicPath && !hasSession) {
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