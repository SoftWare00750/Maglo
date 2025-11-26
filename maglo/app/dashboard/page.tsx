"use client"

import { useEffect } from "react"
import { useMaglo } from "@/lib/context"
import Sidebar from "@/components/ui/sidebar"
import TopBar from "@/components/ui/top-bar"
import DashboardMetrics from "@/app/dashboard/metrics"
import WorkingCapitalChart from "@/app/dashboard/working-capital-chart"
import RecentInvoices from "@/app/dashboard/recent-invoices"
import VATSummary from "@/components/vat-summary"
import DueDateTracker from "@/components/due-date-tracker"

export default function DashboardPage() {
  const { user, isLoading } = useMaglo()

  useEffect(() => {
    document.title = "Dashboard - Maglo"
  }, [])

  // Don't redirect here - let middleware handle authentication
  // The middleware already protects this route

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56">
        <TopBar title="Dashboard" />
        <main className="p-8">
          <DashboardMetrics />
          <WorkingCapitalChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <VATSummary />
            <DueDateTracker />
          </div>
          <RecentInvoices />
        </main>
      </div>
    </div>
  )
}