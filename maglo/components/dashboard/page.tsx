"use client"

import Sidebar from "@/components/ui/sidebar"
import TopBar from "@/components/ui/top-bar"
import DashboardMetrics from "@/components/dashboard/metrics"
import WorkingCapitalChart from "@/components/dashboard/working-capital-chart"
import RecentInvoices from "@/components/dashboard/recent-invoices"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <TopBar />
        <main className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          <DashboardMetrics />
          <WorkingCapitalChart />
          <RecentInvoices />
        </main>
      </div>
    </div>
  )
}