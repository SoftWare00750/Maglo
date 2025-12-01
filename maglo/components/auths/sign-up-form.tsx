"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMaglo } from "@/lib/context"
import { useToast } from "@/lib/toast"
import { ToastContainer } from "@/components/toasts/toast-container"

interface SignUpFormProps {
  onToggle: () => void
}

export default function SignUpForm({ onToggle }: SignUpFormProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { logout } = useMaglo()
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    document.title = "Sign Up - Maglo"
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!fullName) {
      newErrors.fullName = "Full name is required"
    } else if (fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      addToast("Please fix the errors below", "error")
      return
    }

    setIsLoading(true)

    try {
      // Import account from appwrite
      const { account, ID } = await import("@/lib/appwrite")
      
      // Clean up any existing sessions first
      try {
        const sessions = await account.listSessions()
        if (sessions.sessions.length > 0) {
          console.log('🧹 Cleaning up existing sessions')
          for (const session of sessions.sessions) {
            await account.deleteSession(session.$id)
          }
        }
      } catch (error) {
        console.log('ℹ️ No existing sessions')
      }

      console.log('🆕 Creating account for:', email)
      await account.create(ID.unique(), email, password, fullName)
      console.log('✅ Account created')
      
      // Show success message
      addToast("Account created successfully! Please sign in.", "success")
      
      // Wait a moment for the toast to show
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Navigate to sign in page
      onToggle()
      
    } catch (error: any) {
      console.error('❌ Signup error:', error)
      addToast(error.message || "Sign up failed. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex h-screen">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col px-6 py-8 lg:py-12">
          {/* Logo */}
          <div className="mb-12 lg:mb-16">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Maglo Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <h1 className="text-2xl font-bold text-foreground">Maglo.</h1>
            </div>
          </div>

          {/* Centered form content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Form Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Create new account</h2>
                <p className="text-muted-foreground text-sm">Welcome! Please enter your details to get started</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) setErrors({ ...errors, fullName: "" })
                    }}
                    className={errors.fullName ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: "" })
                    }}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: "" })
                    }}
                    className={errors.password ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-lg font-medium"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                {/* Sign In Link */}
                <div className="text-center pt-4">
                  <span className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={onToggle}
                      className="text-primary font-medium hover:underline"
                      disabled={isLoading}
                    >
                      Sign in
                    </button>
                    {/* Desktop curved image - positioned inline */}
                    <img 
                      src="/curve1.png" 
                      alt="Decorative curve" 
                      className="hidden md:inline-block ml-23"
                    />
                  </span>
                  {/* Mobile curved image - positioned under the link */}
                  <img 
                    src="/curve1.png" 
                    alt="Decorative curve" 
                    className="md:hidden mt-1 ml-16 inline-block"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-b from-gray-100 to-gray-200 items-center justify-center relative">
          <Image
            src="/decorate.png"
            alt="decorate"
            fill
            style={{ objectFit: "fill", objectPosition: "absolute" }}
            className="rounded"
          />
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}