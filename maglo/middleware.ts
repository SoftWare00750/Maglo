import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const hostname = request.nextUrl.hostname

  // Public paths that don't require authentication
  const isPublicPath = path === '/'

  // Check if running on localhost or Vercel
  const isLocalhost = hostname === 'localhost' || 
                      hostname === '127.0.0.1' || 
                      hostname.includes('192.168')

  // ⭐ FIXED: Correct hostname format (no protocol or trailing slash)
  const allowedProductionHostnames = [
    "maglo-three.vercel.app",
    "www.maglo-three.vercel.app"
  ]

  // Skip middleware for unknown hostnames in production
  if (!isLocalhost && !allowedProductionHostnames.includes(hostname)) {
    console.log("⚠️ Unknown hostname:", hostname)
    return NextResponse.next()
  }

  // Get Appwrite session cookies
  const cookies = request.cookies.getAll()
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6925f7e8003628848504'

  const hasSession = cookies.some(cookie => 
    cookie.name === `a_session_${projectId}` ||
    cookie.name === `a_session_${projectId}_legacy` ||
    cookie.name.startsWith('a_session_')
  )

  console.log('🌐 Middleware check:', { 
    hostname, 
    path, 
    hasSession,
    isPublicPath 
  })

  // Redirect authenticated users away from login page
  if (isPublicPath && hasSession) {
    console.log('✅ Authenticated user on login page, redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to login
  if (!isPublicPath && !hasSession) {
    console.log('🔒 Unauthenticated user on protected page, redirecting to login')
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