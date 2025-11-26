"use client"

import { useMaglo } from "@/lib/context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, Calendar } from "lucide-react"
import Link from "next/link"

export default function DueDateTracker() {
  const { invoices } = useMaglo()

  const unpaidInvoices = invoices.filter((inv) => inv.status === "Unpaid" || inv.status === "Pending")

  const getCountdown = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const sortedInvoices = [...unpaidInvoices].sort((a, b) => {
    return getCountdown(a.dueDate) - getCountdown(b.dueDate)
  })

  const getStatus = (days: number) => {
    if (days < 0) return { text: "Overdue", color: "bg-red-100 text-red-700", icon: AlertCircle }
    if (days <= 3) return { text: "Due Soon", color: "bg-orange-100 text-orange-700", icon: AlertCircle }
    return { text: "Upcoming", color: "bg-blue-100 text-blue-700", icon: Clock }
  }

  const formatCountdown = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`
    if (days === 0) return "Due today"
    if (days === 1) return "Due tomorrow"
    return `${days} days remaining`
  }

  if (unpaidInvoices.length === 0) {
    return (
      <Card className="p-6 bg-white rounded-lg border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Upcoming Payments</h2>
        </div>
        <div className="text-center py-8">
          <Calendar size={48} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No pending invoices</p>
          <p className="text-sm text-muted-foreground mt-2">All invoices are paid!</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white rounded-lg border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Upcoming Payments</h2>
        <Badge className="bg-orange-100 text-orange-700">
          {unpaidInvoices.length} pending
        </Badge>
      </div>

      <div className="space-y-4">
        {sortedInvoices.slice(0, 5).map((invoice) => {
          const daysRemaining = getCountdown(invoice.dueDate)
          const status = getStatus(daysRemaining)
          const StatusIcon = status.icon

          return (
            <Link
              key={invoice.id}
              href={`/invoices/${invoice.id}`}
              className="block p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{invoice.clientName}</p>
                  <p className="text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
                </div>
                <Badge className={status.color}>
                  <StatusIcon size={14} className="mr-1" />
                  {status.text}
                </Badge>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={14} />
                  <span>{formatCountdown(daysRemaining)}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  ₦{invoice.total.toFixed(2)}
                </span>
              </div>
            </Link>
          )
        })}

        {unpaidInvoices.length > 5 && (
          <Link
            href="/invoices"
            className="block text-center text-sm text-primary font-medium hover:underline mt-4"
          >
            View all {unpaidInvoices.length} pending invoices →
          </Link>
        )}
      </div>
    </Card>
  )
}