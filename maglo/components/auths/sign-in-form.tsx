"use client"

import type React from "react"

import { useState } from "react"
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
  const { setUser } = useMaglo()
  const { toasts, addToast, removeToast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
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
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newUser = {
        id: "1",
        name: "Mahfuzul Nabil",
        email,
        avatar: "MN",
      }
      setUser(newUser)
      addToast("Welcome back!", "success")
      setTimeout(() => router.push("/dashboard"), 500)
    } catch (error) {
      addToast("Sign in failed. Please try again.", "error")
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
              {/* Logo Image */}
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

                {/* Sign Up Link with curved design space */}
                <div className="text-center pt-4">
                  <span className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button type="button" onClick={onToggle} className="text-primary font-medium hover:underline">
                      Sign up for free
                    </button>
                  </span>
                </div>
                <div className="flex justify-center mt-1">
                  <div
                    className="h-2 bg-gray-100 rounded border-2 border-dashed border-gray-300"
                    style={{ width: "fit-content" }}
                  ></div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right side - Image placeholder */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-b from-gray-100 to-gray-200 items-center justify-center" style={{ position: 'relative' }}>
        
        <Image
                src="/decorate.png"
                alt="decorate"
                fill
                style={{ objectFit: "fill", objectPosition:"absolute"}}
                className="rounded"
              />

          <div className="text-center text-gray-500">
             
            <p className="text-lg font-medium"></p>
            <p className="text-sm"> 
              
              </p>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}