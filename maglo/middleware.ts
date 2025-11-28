
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
    "https://maglo-three.vercel.app/",
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

  const hasSession = cookies.some(cookie => 
    cookie.name === `a_session_${projectId}` ||
    cookie.name === `a_session_${projectId}_legacy` ||
    cookie.name.startsWith('a_session_')
  )

  console.log('🌐 Host check:', { hostname, path, hasSession })

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
