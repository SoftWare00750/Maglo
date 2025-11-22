"use client"

import React from "react"

export const Avatar = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...(props as any)}
      className={["inline-flex items-center justify-center overflow-hidden rounded-full", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  )
}

export const AvatarFallback = ({ children }: { children: React.ReactNode }) => {
  return <span className="text-sm font-medium">{children}</span>
}

export default Avatar
