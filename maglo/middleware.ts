import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const hostname = request.nextUrl.hostname

  const isPublicPath = path === '/'

  // Localhost checks
  const isLocalhost = hostname === 'localhost' || 
                      hostname === '127.0.0.1' || 
                      hostname.includes('192.168')

  // ⭐ Add your production hostname(s)
  const allowedHostnames = [
    "maglo-three.vercel.app"
  ]

  // Skip middleware if hostname is not recognized
  if (!isLocalhost && !allowedHostnames.includes(hostname)) {
    console.log("⛔ Skipping middleware for unknown hostname:", hostname)
    return NextResponse.next()
  }

  // Appwrite session cookie checks
  const cookies = request.cookies.getAll()
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6925f7e8003628848504'

  // Check for valid session cookies
  const sessionCookie = cookies.find(cookie => 
    cookie.name === `a_session_${projectId}` ||
    cookie.name === `a_session_${projectId}_legacy`
  )

  // Session is valid only if cookie exists AND has a value
  const hasSession = sessionCookie && sessionCookie.value && sessionCookie.value.length > 0

  console.log('🌐 Middleware check:', { 
    hostname, 
    path, 
    hasSession,
    cookieName: sessionCookie?.name,
    cookieValue: sessionCookie?.value ? 'exists' : 'empty'
  })

  if (isPublicPath && hasSession) {
    console.log('✅ Has session on public path, redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicPath && !hasSession) {
    console.log('🔒 No session on protected path, redirecting to login')
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