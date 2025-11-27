import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/'
  
  // CRITICAL FIX: On localhost, Appwrite uses localStorage (not cookies)
  // So we skip middleware auth checks and let the React context handle it
  const hostname = request.nextUrl.hostname
  const isLocalhost = hostname === 'localhost' || 
                      hostname === '127.0.0.1' || 
                      hostname.includes('192.168')
  
  if (isLocalhost) {
    console.log('🏠 Localhost detected - skipping middleware auth check')
    console.log('✓ Allowing access to:', path)
    return NextResponse.next()
  }
  
  // PRODUCTION ONLY: Check for session cookies
  const cookies = request.cookies.getAll()
  const projectId = '6925f7e8003628848504'
  
  const hasSession = cookies.some(cookie => 
    cookie.name === `a_session_${projectId}` ||
    cookie.name === `a_session_${projectId}_legacy` ||
    cookie.name.startsWith('a_session_')
  )
  
  console.log('🌐 Production middleware check:', { 
    path, 
    hasSession, 
    projectId,
    cookieNames: cookies.map(c => c.name)
  })
  
  // If logged in and trying to access login page, redirect to dashboard
  if (isPublicPath && hasSession) {
    console.log('✅ Redirecting to dashboard - user has session')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If not logged in and trying to access protected page, redirect to login
  if (!isPublicPath && !hasSession) {
    console.log('❌ Redirecting to login - no session found')
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  console.log('✓ Allowing access to:', path)
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