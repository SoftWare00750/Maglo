"use client"

import { useMaglo } from "@/lib/context"
import Link from "next/link"
import { Card } from "../ui/card"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { MoreVertical } from "lucide-react"

export default function RecentInvoices() {
  const { invoices } = useMaglo()
  const recentInvoices = invoices.slice(0, 3)

  return (
    <Card className="p-6 bg-white rounded-lg border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Recent Invoice</h2>
        <Link href="/invoices" className="text-primary font-medium text-sm hover:underline">
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">NAME/CLIENT</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">DATE</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">ORDERS/TYPE</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">AMOUNT</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">STATUS</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {recentInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-4 px-4">
                  <Link href={`/invoices/${invoice.id}`} className="flex items-center space-x-3 hover:underline">
                    <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                      <AvatarFallback>{invoice.clientAvatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{invoice.clientName}</p>
                      <p className="text-xs text-muted-foreground">Inv. {invoice.invoiceNumber}</p>
                    </div>
                  </Link>
                </td>
                <td className="py-4 px-4 text-sm text-foreground">{invoice.issuedDate}</td>
                <td className="py-4 px-4 text-sm text-foreground">20</td>
                <td className="py-4 px-4 text-sm font-medium text-foreground">${invoice.total.toFixed(2)}</td>
                <td className="py-4 px-4">
                  <Badge
                    className={`${
                      invoice.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : invoice.status === "Unpaid"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {invoice.status}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <button className="p-1 hover:bg-secondary rounded transition-colors">
                    <MoreVertical size={16} className="text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
