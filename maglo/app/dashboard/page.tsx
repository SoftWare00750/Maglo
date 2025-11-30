// app/dashboard/page.tsx
"use client"

import { useEffect } from "react"
import { useAuthGuard } from "@/lib/auth-guard"
import Sidebar from "@/components/ui/sidebar"
import TopBar from "@/components/ui/top-bar"
import DashboardMetrics from "@/app/dashboard/metrics"
import WorkingCapitalChart from "@/app/dashboard/working-capital-chart"
import RecentInvoices from "@/app/dashboard/recent-invoices"
import VATSummary from "@/components/vat-summary"
import DueDateTracker from "@/components/due-date-tracker"

export default function DashboardPage() {
  const { user, isLoading } = useAuthGuard()

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

  // Don't render anything if no user (guard will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-56">
        <TopBar title="Dashboard" />
        <main className="p-4 sm:p-6 lg:p-8">
          <DashboardMetrics />
          <WorkingCapitalChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
            <VATSummary />
            <DueDateTracker />
          </div>
          <RecentInvoices />
        </main>
      </div>
    </div>
  )
}