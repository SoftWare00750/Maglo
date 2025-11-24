"use client"

import { useMaglo } from "@/lib/context"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/lib/toast"
import Sidebar from "@/components/ui/sidebar"
import TopBar from "@/components/ui/top-bar"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ToastContainer } from "@/components/toasts/toast-container"
import { MoreVertical, Eye, Download, Plus, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getInvoiceById, updateInvoice, deleteInvoice } = useMaglo()
  const { toasts, addToast, removeToast } = useToast()
  const invoiceId = Array.isArray(params.id) ? params.id[0] : params.id ?? ""
  const invoice = getInvoiceById(invoiceId)
  const [showAddItem, setShowAddItem] = useState(false)

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-56">
          <TopBar title="Invoice Not Found" />
          <main className="p-8">
            <p className="text-foreground">Invoice not found</p>
          </main>
        </div>
      </div>
    )
  }

  const handleStatusChange = (newStatus: "Paid" | "Unpaid" | "Pending") => {
    updateInvoice(invoice.id, { status: newStatus })
    addToast(`Invoice marked as ${newStatus}`, "success")
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(invoice.id)
      addToast("Invoice deleted successfully", "success")
      router.push("/invoices")
    }
  }

  const handleSendInvoice = () => {
    addToast(`Invoice sent to ${invoice.clientEmail}`, "success")
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-56">
          <TopBar title={`Invoice: ${invoice.invoiceNumber}`} />
          <main className="p-8">
            {/* Three Dots Menu - Top Right */}
            <div className="flex items-center justify-end mb-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-secondary rounded transition-colors">
                    <MoreVertical size={20} className="text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete}>
                    <div className="flex items-center text-red-600">
                      <Trash2 size={16} className="mr-2" />
                      Delete Invoice
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side - Invoice Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Info */}
                <Card className="bg-gray-800 text-white p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {/* Logo Placeholder */}
                        <Image
            src="/logo2.png"
            alt="Maglo Logo"
            width={32}
            height={32}
            className="rounded"
          />
                    
                      <div>
                        <p className="text-2xl font-bold mb-1">Maglo</p>
                        <p className="text-sm text-gray-300">sales@maglo.com</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-300">
                      <p>1333 Grey Fox Farm Road</p>
                      <p>Houston, TX 77060</p>
                      <p>Bloomfield Hills, Michigan(MI), 48301</p>
                    </div>
                  </div>
                </Card>

                {/* Invoice Number & Dates */}
                <Card className="p-6 bg-white rounded-lg border border-border">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-foreground mb-3">Invoice Number</h3>
                      <p className="text-lg font-semibold text-foreground mb-4">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">Issued Date: {invoice.issuedDate}</p>
                      <p className="text-sm text-muted-foreground">Due Date: {invoice.dueDate}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-3">Billed to</h3>
                      <p className="font-medium text-foreground">{invoice.clientName}</p>
                      <p className="text-sm text-muted-foreground">{invoice.clientEmail}</p>
                    </div>
                  </div>
                </Card>

                {/* Item Details */}
                <Card className="p-6 bg-white rounded-lg border border-border">
                  <div className="mb-6">
                    <h3 className="font-bold text-foreground mb-1">Item Details</h3>
                    <p className="text-sm text-muted-foreground">Details item with more info</p>
                  </div>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 text-xs font-semibold text-muted-foreground">ITEM</th>
                          <th className="text-left py-3 text-xs font-semibold text-muted-foreground">ORDER/TYPE</th>
                          <th className="text-left py-3 text-xs font-semibold text-muted-foreground">RATE</th>
                          <th className="text-left py-3 text-xs font-semibold text-muted-foreground">AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items && invoice.items.length > 0 ? (
                          invoice.items.map((item) => (
                            <tr key={item.id} className="border-b border-border">
                              <td className="py-3 text-sm text-foreground">{item.name}</td>
                              <td className="py-3 text-sm text-foreground">{item.quantity}</td>
                              <td className="py-3 text-sm text-foreground">₦{item.rate.toFixed(2)}</td>
                              <td className="py-3 text-sm font-medium text-foreground">₦{item.amount.toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b border-border">
                            <td colSpan={4} className="py-3 text-sm text-foreground text-center">
                              No items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={() => setShowAddItem(!showAddItem)}
                    className="text-primary font-medium text-sm hover:underline flex items-center gap-1 mb-4"
                  >
                    <Plus size={16} />
                    Add Item
                  </button>

                  {/* Totals */}
                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">₦{invoice.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <button className="text-primary font-medium text-sm">Add</button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <button className="text-primary font-medium text-sm">Add</button>
                    </div>
                    <div className="flex justify-between border-t border-border pt-3 mt-3">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-lg text-foreground">₦{invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Side - Actions & Client Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Client Details */}
                <Card className="p-6 bg-white rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground">Client Details</h3>
                    <button className="p-1 hover:bg-secondary rounded">
                      <MoreVertical size={16} className="text-muted-foreground" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 mb-6">
                    <Avatar className="w-12 h-12 bg-primary text-primary-foreground">
                      <AvatarFallback>{invoice.clientAvatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{invoice.clientName}</p>
                      <p className="text-xs text-muted-foreground">{invoice.clientEmail}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-sm font-medium text-foreground">UIHUT Agency LTD</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        ✓ 3471 Rainy Day Drive Tulsa, USA
                      </p>
                    </div>
                    <Button className="w-full text-primary font-medium text-sm border border-primary bg-transparent hover:bg-primary/10">
                      Add Customer
                    </Button>
                  </div>
                </Card>

                {/* Basic Info */}
                <Card className="p-6 bg-white rounded-lg border border-border">
                  <h3 className="font-bold text-foreground mb-4">Basic Info</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">Invoice Date</label>
                      <p className="text-sm text-foreground font-medium">{invoice.issuedDate}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">Due Date</label>
                      <p className="text-sm text-foreground font-medium">{invoice.dueDate}</p>
                    </div>
                  </div>
                </Card>

                {/* Status & Actions */}
                <Card className="p-6 bg-white rounded-lg border border-border space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-2">Status</label>
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
                  </div>

                  {invoice.status !== "Paid" && (
                    <Button
                      onClick={() => handleStatusChange("Paid")}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Mark as Paid
                    </Button>
                  )}

                  <Button
                    onClick={handleSendInvoice}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Send Invoice
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 bg-transparent">
                      <Eye size={16} />
                      Preview
                    </Button>
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 bg-transparent">
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}