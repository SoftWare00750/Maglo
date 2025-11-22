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

type AsChildProps = {
  onClick?: (e: React.MouseEvent) => void
} & Record<string, any>

export const DropdownMenuTrigger = ({
  children,
  asChild,
}: {
  children: ReactElement<AsChildProps>;
  asChild?: boolean;
}) => {
  const { toggle } = useDropdown();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        (children.props as AsChildProps).onClick?.(e);
        toggle();
      },
    });
  }

  return (
    <button onClick={toggle} type="button">
      {children}
    </button>
  );
};



export const DropdownMenuContent = forwardRef<
  HTMLDivElement, 
  { children: ReactNode; className?: string; align?: string }
>(({ children, className = "", align }, ref) => {
  const { open } = useDropdown()
  if (!open) return null
  
  const alignClasses = align === "end" ? "right-0" : "left-0"
  
  return (
    <div 
      ref={ref} 
      className={`absolute mt-2 ${alignClasses} min-w-[200px] rounded-md border border-border bg-popover p-1 shadow-md z-50 ${className}`}
      role="menu"
    >
      {children}
    </div>
  )
})

DropdownMenuContent.displayName = "DropdownMenuContent"

export const DropdownMenuItem = ({ 
  children, 
  onClick 
}: { 
  children: ReactNode; 
  onClick?: () => void 
}) => {
  const { setOpen } = useDropdown()
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    setOpen(false)
  }
  
  return (
    <button
      role="menuitem"
      onClick={handleClick}
      className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
    >
      {children}
    </button>
  )
}

export const DropdownMenuSeparator = () => <div className="my-1 border-t border-border" />

export default DropdownMenu