"use client"

import { useEffect, useState } from "react"
import { useAuthGuard } from "@/lib/auth-guard"
import Sidebar from "@/components/ui/sidebar"
import TopBar from "@/components/ui/top-bar"
import DashboardMetrics from "@/app/dashboard/metrics"
import WorkingCapitalChart from "@/app/dashboard/working-capital-chart"
import RecentInvoices from "@/app/dashboard/recent-invoices"
import VATSummary from "@/components/vat-summary"
import DueDateTracker from "@/components/due-date-tracker"
import { Menu, X } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuthGuard()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.title = "Dashboard - Maglo"
  }, [])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // FIXED: Show loading while redirect happens (don't show blank screen)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-md"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar with mobile overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="relative">
          <Sidebar />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="lg:ml-56">
        <TopBar title="Dashboard" />
        <main className="p-4 sm:p-6 lg:p-8">
          <DashboardMetrics />
          <WorkingCapitalChart />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
            <VATSummary />
            <DueDateTracker />
          </div>
          <RecentInvoices />
        </main>
      </div>
    </div>
  )
}