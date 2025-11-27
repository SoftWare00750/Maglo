"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMaglo } from "@/lib/context"

/**
 * Hook to protect routes that require authentication
 * Usage: Call this at the top of any protected page component
 */
export function useAuthGuard() {
  const { user, isLoading } = useMaglo()
  const router = useRouter()

  useEffect(() => {
    // Only redirect after loading is complete and no user is found
    if (!isLoading && !user) {
      console.log('🔒 Auth guard: No user, redirecting to login')
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

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (!isLoading && user) {
      console.log('✅ Already authenticated, redirecting to dashboard')
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  return { user, isLoading }
}