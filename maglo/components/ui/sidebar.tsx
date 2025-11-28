"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useMaglo } from "@/lib/context"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setUser } = useMaglo()

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    setUser(null)
    router.push("/")
  }

  return (
    <div className="w-56 bg-background border-r border-border h-screen flex flex-col p-4 sm:p-6 overflow-hidden fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="mb-6 sm:mb-8 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Maglo Logo"
            width={28}
            height={28}
            className="rounded sm:w-8 sm:h-8"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Maglo.</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 sm:space-y-2 overflow-y-auto">
        <Link href="/dashboard">
          <div
            className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
              isActive("/dashboard")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Image
              src={isActive("/dashboard") ? "/icons/dashboard-active.png" : "/icons/dashboard-inactive.png"}
              alt="Dashboard"
              width={18}
              height={18}
              className="sm:w-5 sm:h-5"
            />
            <span className="font-medium text-sm sm:text-base">Dashboard</span>
          </div>
        </Link>

        <Link href="/transactions">
          <div
            className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
              isActive("/transactions")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Image
              src={isActive("/transactions") ? "/icons/transactions-active.png" : "/icons/transactions-inactive.png"}
              alt="Transactions"
              width={18}
              height={18}
              className="sm:w-5 sm:h-5"
            />
            <span className="font-medium text-sm sm:text-base">Transactions</span>
          </div>
        </Link>

        <Link href="/invoices">
          <div
            className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
              isActive("/invoices") || pathname.startsWith("/invoices")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Image
              src={isActive("/invoices") || pathname.startsWith("/invoices") ? "/icons/invoices-active.png" : "/icons/invoices-inactive.png"}
              alt="Invoices"
              width={18}
              height={18}
              className="sm:w-5 sm:h-5"
            />
            <span className="font-medium text-sm sm:text-base">Invoices</span>
          </div>
        </Link>

        <Link href="/wallets">
          <div
            className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
              isActive("/wallets")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Image
              src={isActive("/wallets") ? "/icons/wallets-active.png" : "/icons/wallets-inactive.png"}
              alt="My Wallets"
              width={18}
              height={18}
              className="sm:w-5 sm:h-5"
            />
            <span className="font-medium text-sm sm:text-base">My Wallets</span>
          </div>
        </Link>

        <Link href="/settings">
          <div
            className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
              isActive("/settings")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Image
              src={isActive("/settings") ? "/icons/settings-active.png" : "/icons/settings-inactive.png"}
              alt="Settings"
              width={18}
              height={18}
              className="sm:w-5 sm:h-5"
            />
            <span className="font-medium text-sm sm:text-base">Settings</span>
          </div>
        </Link>
      </nav>

      {/* Bottom */}
      <div className="space-y-1 sm:space-y-2 flex-shrink-0 mt-4">
        <Link href="/help">
          <div className="flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Image
              src={isActive("/help") ? "/icons/help-active.png" : "/icons/help-inactive.png"}
              alt="Help"
              width={18}
              height={18}
              className="sm:w-5 sm:h-5"
            />
            <span className="font-medium text-sm sm:text-base">Help</span>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Image
            src="/icons/logout-inactive.png"
            alt="Logout"
            width={18}
            height={18}
            className="sm:w-5 sm:h-5"
          />
          <span className="font-medium text-sm sm:text-base">Logout</span>
        </button>
      </div>
    </div>
  )
}