"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMaglo } from "@/lib/context"
import { LayoutDashboard, FileText, Wallet, Settings, LogOut, BarChart3, HelpCircle } from "lucide-react"

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
    <div className="w-56 bg-background border-r border-border min-h-screen flex flex-col p-6">
      {/* Logo */}
      <div className="mb-8">
        <div className="text-2xl font-bold">
          <span className="text-black">m</span>
          <span className="text-black">Maglo.</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <Link href="/dashboard">
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/dashboard")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard size={20} />
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
            <BarChart3 size={20} />
            <span className="font-medium">Transactions</span>
          </div>
        </Link>

        <Link href="/invoices">
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/invoices")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText size={20} />
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
            <Wallet size={20} />
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
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </div>
        </Link>
      </nav>

      {/* Bottom */}
      <div className="space-y-2">
        <Link href="/help">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle size={20} />
            <span className="font-medium">Help</span>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
