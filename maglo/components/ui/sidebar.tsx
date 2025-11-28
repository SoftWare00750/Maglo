"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useMaglo } from "@/lib/context"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useMaglo()

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
  try {
    await logout()
    router.push("/signin")
    router.refresh()
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

  return (
    <div className="w-56 bg-background border-r border-border h-screen flex flex-col p-6 overflow-hidden fixed left-0 top-0">
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
        <Link href="/dashboard">
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

        <Link href="/transactions">
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

        <Link href="/invoices">
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

        <Link href="/wallets">
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

        <Link href="/settings">
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
      <div className="space-y-2 flex-shrink-0">
        <Link href="/help">
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
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
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
    </div>
  )
}