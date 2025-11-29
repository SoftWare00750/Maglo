"use client"

import { useMaglo } from "@/lib/context"
import { useToast } from "@/lib/toast"
import Link from "next/link"
import Sidebar from "@/components/ui/sidebar"
import TopBar from "@/components/ui/top-bar"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Plus, Menu, X, Trash2, CheckCircle, Clock, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ToastContainer } from "@/components/toasts/toast-container"

export default function InvoicesPage() {
  const { invoices, updateInvoice, deleteInvoice } = useMaglo()
  const { toasts, addToast, removeToast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const handleStatusChange = async (invoiceId: string, newStatus: "Paid" | "Unpaid" | "Pending") => {
    try {
      await updateInvoice(invoiceId, { status: newStatus })
      addToast(`Invoice marked as ${newStatus}`, "success")
    } catch (error) {
      console.error('Error updating invoice:', error)
      addToast("Failed to update invoice status", "error")
    }
  }

  const handleDelete = async (invoiceId: string, invoiceNumber: string) => {
    if (confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      try {
        await deleteInvoice(invoiceId)
        addToast("Invoice deleted successfully", "success")
      } catch (error) {
        console.error('Error deleting invoice:', error)
        addToast("Failed to delete invoice", "error")
      }
    }
  }

  return (
    <>
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

        <div className="lg:ml-56">
          <TopBar title="Invoices" />
          <main className="p-4 sm:p-6 lg:p-8">
            {/* Create Invoice Button */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
              <div className="flex-1"></div>
              <Link href="/invoices/create">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 h-10 sm:h-11 text-sm sm:text-base px-3 sm:px-4">
                  <Plus size={18} />
                  <span className="hidden sm:inline">Create Invoice</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search invoices"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-secondary border border-border rounded-lg text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors text-sm sm:text-base">
                <span className="font-medium">Filters</span>
              </button>
            </div>

            {/* Desktop Table View */}
            <Card className="hidden md:block bg-white rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left py-4 px-4 lg:px-6 text-xs font-semibold text-muted-foreground">NAME/CLIENT</th>
                      <th className="text-left py-4 px-4 lg:px-6 text-xs font-semibold text-muted-foreground">DATE</th>
                      <th className="text-left py-4 px-4 lg:px-6 text-xs font-semibold text-muted-foreground">ORDERS/TYPE</th>
                      <th className="text-left py-4 px-4 lg:px-6 text-xs font-semibold text-muted-foreground">AMOUNT</th>
                      <th className="text-left py-4 px-4 lg:px-6 text-xs font-semibold text-muted-foreground">STATUS</th>
                      <th className="text-left py-4 px-4 lg:px-6 text-xs font-semibold text-muted-foreground">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-4 px-4 lg:px-6">
                          <Link href={`/invoices/${invoice.id}`} className="flex items-center space-x-3 hover:underline">
                            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-primary-foreground">
                              <AvatarFallback>{invoice.clientAvatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground text-sm lg:text-base">{invoice.clientName}</p>
                              <p className="text-xs text-muted-foreground">Inv. {invoice.invoiceNumber}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-4 lg:px-6 text-sm text-foreground">{invoice.issuedDate}</td>
                        <td className="py-4 px-4 lg:px-6 text-sm text-foreground">20</td>
                        <td className="py-4 px-4 lg:px-6 text-sm font-semibold text-foreground">₦{invoice.total.toFixed(2)}</td>
                        <td className="py-4 px-4 lg:px-6">
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
                        <td className="py-4 px-4 lg:px-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-secondary rounded transition-colors">
                                <MoreVertical size={16} className="text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "Paid")}>
                                <div className="flex items-center text-green-600">
                                  <CheckCircle size={16} className="mr-2" />
                                  Mark as Paid
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "Pending")}>
                                <div className="flex items-center text-orange-600">
                                  <Clock size={16} className="mr-2" />
                                  Mark as Pending
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "Unpaid")}>
                                <div className="flex items-center text-red-600">
                                  <XCircle size={16} className="mr-2" />
                                  Mark as Unpaid
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(invoice.id, invoice.invoiceNumber)}>
                                <div className="flex items-center text-red-600">
                                  <Trash2 size={16} className="mr-2" />
                                  Delete Invoice
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="p-4 bg-white rounded-lg border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <Link href={`/invoices/${invoice.id}`} className="flex items-center space-x-3 flex-1">
                      <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
                        <AvatarFallback>{invoice.clientAvatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{invoice.clientName}</p>
                        <p className="text-xs text-muted-foreground">Inv. {invoice.invoiceNumber}</p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-secondary rounded transition-colors">
                            <MoreVertical size={16} className="text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "Paid")}>
                            <div className="flex items-center text-green-600">
                              <CheckCircle size={16} className="mr-2" />
                              Mark as Paid
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "Pending")}>
                            <div className="flex items-center text-orange-600">
                              <Clock size={16} className="mr-2" />
                              Mark as Pending
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "Unpaid")}>
                            <div className="flex items-center text-red-600">
                              <XCircle size={16} className="mr-2" />
                              Mark as Unpaid
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(invoice.id, invoice.invoiceNumber)}>
                            <div className="flex items-center text-red-600">
                              <Trash2 size={16} className="mr-2" />
                              Delete Invoice
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">{invoice.issuedDate}</div>
                    <div className="font-semibold text-foreground">₦{invoice.total.toFixed(2)}</div>
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}