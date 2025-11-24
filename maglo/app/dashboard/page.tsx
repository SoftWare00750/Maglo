"use client"

import Sidebar from "@/components/ui/sidebar"
import TopBar from "@/components/ui/top-bar"
import DashboardMetrics from "@/app/dashboard/metrics"
import WorkingCapitalChart from "@/app/dashboard/working-capital-chart"
import RecentInvoices from "@/app/dashboard/recent-invoices"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56">
        <TopBar title="Dashboard" />
        <main className="p-8">
          <DashboardMetrics />
          <WorkingCapitalChart />
          <RecentInvoices />
        </main>
      </div>
    </div>
  )
}