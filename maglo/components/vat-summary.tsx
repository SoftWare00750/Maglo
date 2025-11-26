"use client"

import { useMaglo } from "@/lib/context"
import { Card } from "@/components/ui/card"
import { Calendar, TrendingUp, DollarSign } from "lucide-react"

export default function VATSummary() {
  const { invoices, getTotalVAT, getTotalPaid } = useMaglo()

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const monthlyInvoices = invoices.filter((inv) => {
    const invoiceDate = new Date(inv.issuedDate)
    return (
      invoiceDate.getMonth() === currentMonth &&
      invoiceDate.getFullYear() === currentYear &&
      inv.status === "Paid"
    )
  })

  const monthlyVAT = monthlyInvoices.reduce((sum, inv) => sum + inv.vatAmount, 0)
  const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalVAT = getTotalVAT()
  const totalPaid = getTotalPaid()

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long' })

  return (
    <Card className="p-6 bg-white rounded-lg border border-border mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">VAT Summary</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          <span>{monthName} {currentYear}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp size={16} />
            <span>VAT This Month</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₦{monthlyVAT.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">From {monthlyInvoices.length} paid invoices</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign size={16} />
            <span>Total VAT Collected</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₦{totalVAT.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">All time collection</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp size={16} />
            <span>Revenue This Month</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₦{monthlyRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Including VAT</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4">Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gross Revenue (Before VAT)</span>
            <span className="font-medium">₦{(totalPaid - totalVAT).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VAT Collected</span>
            <span className="font-medium">₦{totalVAT.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold border-t border-border pt-3">
            <span className="text-foreground">Total Revenue</span>
            <span className="text-foreground">₦{totalPaid.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}