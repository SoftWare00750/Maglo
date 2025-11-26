"use client"


import { useMaglo } from "@/lib/context"
import Link from "next/link"
import Sidebar from "@/components/ui/sidebar"
import TopBar from "@/components/ui/top-bar"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Plus } from "lucide-react"

export default function InvoicesPage() {
  const { invoices } = useMaglo()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "All" || inv.status === filterStatus

    return matchesSearch && matchesStatus
  })

    useEffect(() => {
    document.title = "Invoices - Maglo"
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56">
        <TopBar title="Invoices" />
        <main className="p-8">
          {/* Create Invoice Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1"></div>
            <Link href="/invoices/create">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
                <Plus size={20} />
                Create Invoice
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search invoices"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>

          {/* Invoices Table */}
          <Card className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground">NAME/CLIENT</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground">DATE</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground">ORDERS/TYPE</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground">AMOUNT</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground">STATUS</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-4 px-6">
                        <Link href={`/invoices/${invoice.id}`} className="flex items-center space-x-3 hover:underline">
                          <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
                            <AvatarFallback>{invoice.clientAvatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{invoice.clientName}</p>
                            <p className="text-xs text-muted-foreground">Inv. {invoice.invoiceNumber}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-sm text-foreground">{invoice.issuedDate}</td>
                      <td className="py-4 px-6 text-sm text-foreground">20</td>
                      <td className="py-4 px-6 text-sm font-semibold text-foreground">₦{invoice.total.toFixed(2)}</td>
                      <td className="py-4 px-6">
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
                      <td className="py-4 px-6">
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
        </main>
      </div>
    </div>
  )
}