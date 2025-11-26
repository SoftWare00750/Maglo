import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Public path is just the login page
  const isPublicPath = path === '/'
  
  // Check for session cookie - try both legacy and new format
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''
  const sessionCookie = request.cookies.get(`a_session_${projectId}`) || 
                       request.cookies.get(`a_session_${projectId}_legacy`)
  
  console.log('Middleware:', { path, hasSession: !!sessionCookie, cookies: request.cookies.getAll() })
  
  // If logged in and trying to access login page, redirect to dashboard
  if (isPublicPath && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If not logged in and trying to access protected page, redirect to login
  if (!isPublicPath && !sessionCookie) {
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