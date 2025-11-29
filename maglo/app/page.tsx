"use client"

import { useState } from "react"
import { useRedirectIfAuthenticated } from "@/lib/auth-guard"
import SignInForm from "@/components/auths/sign-in-form"
import SignUpForm from "@/components/auths/sign-up-form"

export default function AuthPage() {
  const [showSignUp, setShowSignUp] = useState(false)
  const { user, isLoading } = useRedirectIfAuthenticated()

  // Show loading while checking auth
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

  // Don't render forms if user is logged in (guard will redirect)
  if (user) {
    return null
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