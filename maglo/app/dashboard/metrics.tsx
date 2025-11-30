// app/dashboard/metrics.tsx
"use client"

import { useMaglo } from "@/lib/context"
import { Card } from "@/components/ui/card"
import { DollarSign, Check, Clock } from "lucide-react"

export default function DashboardMetrics() {
  const { getTotalInvoices, getTotalPaid, getPendingPayments } = useMaglo()

  const metrics = [
    {
      label: "Total invoice",
      value: `$${getTotalInvoices().toFixed(2)}`,
      icon: DollarSign,
      bgColor: "bg-gray-800",
      textColor: "text-white",
    },
    {
      label: "Amount Paid",
      value: `$${getTotalPaid().toFixed(2)}`,
      icon: Check,
      bgColor: "bg-white",
      textColor: "text-foreground",
    },
    {
      label: "Pending Payment",
      value: `$${getPendingPayments().toFixed(2)}`,
      icon: Clock,
      bgColor: "bg-white",
      textColor: "text-foreground",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon
        return (
          <Card key={idx} className={`${metric.bgColor} p-4 sm:p-6 rounded-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm ${metric.textColor} opacity-70`}>{metric.label}</p>
                <p className={`text-xl sm:text-2xl font-bold ${metric.textColor} mt-2`}>{metric.value}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-lg ${metric.bgColor === "bg-white" ? "bg-gray-100" : "bg-gray-700"}`}>
                <Icon size={20} className={`sm:w-6 sm:h-6 ${metric.textColor}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}