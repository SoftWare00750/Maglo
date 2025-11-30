// components/ui/sidebar.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useMaglo } from "@/lib/context"
import { useMobileNav } from "@/lib/use-mobile-nav"
import { X } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useMaglo()
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileNav()

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    try {
      await logout()
      setIsMobileMenuOpen(false)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleNavClick = () => {
    // Close mobile menu when a nav item is clicked
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block w-56 bg-background border-r border-border h-screen flex-col p-6 overflow-hidden fixed left-0 top-0">
        <SidebarContent 
          isActive={isActive} 
          handleLogout={handleLogout}
          onNavClick={handleNavClick}
        />
      </div>

      {/* Mobile Sidebar - Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative w-64 h-full bg-background border-r border-border flex flex-col p-6 overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X size={20} />
            </button>

            <SidebarContent 
              isActive={isActive} 
              handleLogout={handleLogout}
              onNavClick={handleNavClick}
            />
          </div>
        </div>
      )}
    </>
  )
}

function SidebarContent({ 
  isActive, 
  handleLogout, 
  onNavClick 
}: { 
  isActive: (path: string) => boolean
  handleLogout: () => void
  onNavClick: () => void
}) {
  const pathname = usePathname()
  
  return (
    <>
      {/* Logo */}
      <div className="mb-8 flex-shrink-0">
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

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        <Link href="/dashboard" onClick={onNavClick}>
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/dashboard")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image
              src={isActive("/dashboard") ? "/icons/dashboard-active.png" : "/icons/dashboard-inactive.png"}
              alt="Dashboard"
              width={20}
              height={20}
            />
            <span className="font-medium">Dashboard</span>
          </div>
        </Link>

        <Link href="/transactions" onClick={onNavClick}>
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/transactions")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image
              src={isActive("/transactions") ? "/icons/transactions-active.png" : "/icons/transactions-inactive.png"}
              alt="Transactions"
              width={20}
              height={20}
            />
            <span className="font-medium">Transactions</span>
          </div>
        </Link>

        <Link href="/invoices" onClick={onNavClick}>
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/invoices") || pathname.startsWith("/invoices")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image
              src={isActive("/invoices") || pathname.startsWith("/invoices") ? "/icons/invoices-active.png" : "/icons/invoices-inactive.png"}
              alt="Invoices"
              width={20}
              height={20}
            />
            <span className="font-medium">Invoices</span>
          </div>
        </Link>

        <Link href="/wallets" onClick={onNavClick}>
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/wallets")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image
              src={isActive("/wallets") ? "/icons/wallets-active.png" : "/icons/wallets-inactive.png"}
              alt="My Wallets"
              width={20}
              height={20}
            />
            <span className="font-medium">My Wallets</span>
          </div>
        </Link>

        <Link href="/settings" onClick={onNavClick}>
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/settings")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image
              src={isActive("/settings") ? "/icons/settings-active.png" : "/icons/settings-inactive.png"}
              alt="Settings"
              width={20}
              height={20}
            />
            <span className="font-medium">Settings</span>
          </div>
        </Link>
      </nav>

      {/* Bottom */}
      <div className="space-y-2 flex-shrink-0 mt-4">
        <Link href="/help" onClick={onNavClick}>
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            <Image
              src={isActive("/help") ? "/icons/help-active.png" : "/icons/help-inactive.png"}
              alt="Help"
              width={20}
              height={20}
            />
            <span className="font-medium">Help</span>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-red-50 transition-colors"
        >
          <Image
            src="/icons/logout-inactive.png"
            alt="Logout"
            width={20}
            height={20}
          />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  )
}