"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useMaglo } from "@/lib/context"

/**
 * Hook to protect routes that require authentication
 * Usage: Call this at the top of any protected page component
 */
export function useAuthGuard() {
  const { user, isLoading } = useMaglo()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // FIXED: Only redirect once loading is complete, user is null, and we haven't redirected yet
    if (!isLoading && !user && !hasRedirected.current) {
      console.log('🔒 Auth guard: No user found, redirecting to login')
      hasRedirected.current = true
      router.push("/")
    }
  }, [user, isLoading, router])

  return { user, isLoading }
}

/**
 * Hook to redirect authenticated users away from auth pages
 * Usage: Call this in sign-in/sign-up pages
 */
export function useRedirectIfAuthenticated() {
  const { user, isLoading } = useMaglo()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // FIXED: Only redirect once loading is complete, user exists, and we haven't redirected yet
    if (!isLoading && user && !hasRedirected.current) {
      console.log('✅ Already authenticated, redirecting to dashboard')
      hasRedirected.current = true
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  return { user, isLoading }
}