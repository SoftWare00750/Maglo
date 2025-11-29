// lib/cookie-cleanup.ts
"use client"

/**
 * Clean up all Appwrite cookies
 * Call this when you detect corrupted auth state
 */
export function cleanupAppwriteCookies() {
  console.log('🧹 Cleaning up Appwrite cookies...')
  
  // Get all cookies
  const cookies = document.cookie.split(';')
  
  // Delete all Appwrite session cookies
  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim()
    
    // Check if it's an Appwrite session cookie
    if (cookieName.startsWith('a_session_')) {
      // Delete for current domain
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;`
      
      // Delete for all possible domains
      const domains = [
        '',
        window.location.hostname,
        '.' + window.location.hostname
      ]
      
      domains.forEach(domain => {
        const domainStr = domain ? `;domain=${domain}` : ''
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/${domainStr}`
      })
      
      console.log('🗑️ Deleted cookie:', cookieName)
    }
  })
  
  console.log('✅ Cookie cleanup complete')
}

/**
 * Check if auth state is corrupted
 */
export function hasCorruptedAuthState(): boolean {
  const cookies = document.cookie.split(';')
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6925f7e8003628848504'
  
  // Check for multiple session cookies (shouldn't happen)
  const sessionCookies = cookies.filter(cookie => 
    cookie.trim().startsWith(`a_session_${projectId}`)
  )
  
  // More than one session cookie = corrupted state
  return sessionCookies.length > 1
}