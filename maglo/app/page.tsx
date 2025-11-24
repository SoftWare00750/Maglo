"use client"

import { useState } from "react"
import SignInForm from "@/components/auths/sign-in-form"
import SignUpForm from "@/components/auths/sign-up-form"

export default function AuthPage() {
  const [showSignUp, setShowSignUp] = useState(false)

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