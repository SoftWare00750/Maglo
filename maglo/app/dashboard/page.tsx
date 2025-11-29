"use client"

import { useState, useEffect } from "react"
import { useRedirectIfAuthenticated } from "@/lib/auth-guard"
import SignInForm from "@/components/auths/sign-in-form"
import SignUpForm from "@/components/auths/sign-up-form"

export default function AuthPage() {
  const [showSignUp, setShowSignUp] = useState(false)
  const { user, isLoading } = useRedirectIfAuthenticated()
  const [error, setError] = useState<string | null>(null)

  // Check for missing env vars
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
      setError("Missing Appwrite configuration. Please check environment variables.")
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-700">{error}</p>
          <p className="text-sm text-gray-500 mt-4">Check Vercel environment variables</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // FIXED: Don't render anything if user exists (redirect will happen)
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showSignUp ? (
        <SignUpForm onToggle={() => setShowSignUp(false)} />
      ) : (
        <SignInForm onToggle={() => setShowSignUp(true)} />
      )}
    </>
  )
}