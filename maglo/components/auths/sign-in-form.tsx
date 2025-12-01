"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMaglo } from "@/lib/context"
import { useToast } from "@/lib/toast"
import { ToastContainer } from "@/components/toasts/toast-container"

interface SignInFormProps {
  onToggle: () => void
}

export default function SignInForm({ onToggle }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { login, user } = useMaglo()
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    document.title = "Sign In - Maglo"
  }, [])

  // Redirect if already logged in (but don't interfere with login flow)
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard")
    }
  }, [user, router]) // Removed isLoading from deps to avoid interference

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

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
      // Login - this will set user state in context
      await login(email, password)
      
      // Show success message
      const userName = email.split('@')[0]
      addToast(`Welcome back, ${userName}!`, "success")
      
      // User state is now set, the useEffect will handle navigation
      // But we also explicitly navigate to ensure it happens
      router.push("/dashboard")
      router.refresh()
      
    } catch (error: any) {
      console.error("Login error:", error)
      addToast(error.message || "Sign in failed. Please try again.", "error")
    } finally {
      // IMPORTANT: Always reset loading state
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
                <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
                <p className="text-muted-foreground text-sm">Welcome back! Please enter your details</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
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
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-border"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-foreground">Remember for 30 Days</span>
                  </label>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Forgot password
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-lg font-medium"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center pt-4 relative">
                  <span className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={onToggle}
                      className="text-primary font-medium hover:underline"
                      disabled={isLoading}
                    >
                      Sign up for free
                    </button>
                  </span>
                  <img 
                    src="/curve2.png" 
                    alt="Decorative curve" 
                    className="hidden md:inline-block md:ml-64 absolute md:relative"
                  />
                  {/* Mobile curved image - positioned under the link */}
                  <img 
                    src="/curve2.png" 
                    alt="Decorative curve" 
                    className="md:hidden mt-1 ml-32"
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