"use client"

import React, { createContext, useContext, useState, ReactNode, ReactElement, cloneElement, forwardRef } from "react"

type DropdownContextType = {
  open: boolean
  setOpen: (v: boolean) => void
  toggle: () => void
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined)

export const DropdownMenu = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((v) => !v)
  return <DropdownContext.Provider value={{ open, setOpen, toggle }}>{children}</DropdownContext.Provider>
}

function useDropdown() {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error("Dropdown components must be used within DropdownMenu")
  return ctx
}

export const DropdownMenuTrigger = ({ children, asChild }: { children: ReactElement; asChild?: boolean }) => {
  const { toggle } = useDropdown()

  if (asChild && React.isValidElement(children)) {
    return cloneElement(children, { onClick: (e: any) => { children.props.onClick?.(e); toggle() } })
  }

  return (
    <button onClick={toggle} type="button">
      {children}
    </button>
  )
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, { children: ReactNode; className?: string; align?: string }>(
  ({ children, className = "", align }, ref) => {
    const { open } = useDropdown()
    if (!open) return null
    return (
      <div ref={ref} className={className} role="menu" data-align={align}>
        {children}
      </div>
    )
  }
)

DropdownMenuContent.displayName = "DropdownMenuContent"

export const DropdownMenuItem = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="w-full text-left px-3 py-2 hover:bg-secondary transition-colors"
    >
      {children}
    </button>
  )
}

export const DropdownMenuSeparator = () => <div className="my-1 border-t border-border" />

export default DropdownMenu
