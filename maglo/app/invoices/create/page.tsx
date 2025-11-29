"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMaglo } from "@/lib/context"
import { useToast } from "@/lib/toast"
import Sidebar from "@/components/ui/sidebar"
import TopBar from "@/components/ui/top-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastContainer } from "@/components/toasts/toast-container"
import { Plus, Trash2 } from "lucide-react"

interface FormItem {
  id: string
  name: string
  quantity: number
  rate: number
  amount: number
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const { addInvoice } = useMaglo()
  const { toasts, addToast, removeToast } = useToast()
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [vat, setVat] = useState("5")
  const [dueDate, setDueDate] = useState("")
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().split("T")[0])
  const [items, setItems] = useState<FormItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    document.title = "Create Invoice - Maglo"
  }, [])

  // Calculate subtotal from line items - AUTO-GENERATED
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0)
  }

  // Calculate VAT - AUTO-GENERATED
  const calculateVAT = () => {
    const subtotal = calculateSubtotal()
    const vatPercent = Number.parseFloat(vat) || 0
    return (subtotal * vatPercent) / 100
  }

  // Calculate total - AUTO-GENERATED
  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT()
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!clientName.trim()) {
      newErrors.clientName = "Client name is required"
    }

    if (!clientEmail) {
      newErrors.clientEmail = "Client email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      newErrors.clientEmail = "Invalid email format"
    }

    if (items.length === 0) {
      newErrors.items = "At least one line item is required"
    } else {
      // Check if all items have names
      const hasEmptyItems = items.some(item => !item.name.trim())
      if (hasEmptyItems) {
        newErrors.items = "All line items must have a name"
      }
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ])
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    addToast("Item removed", "info")
  }

  const handleItemChange = (id: string, field: string, value: string) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          if (field === "name") {
            return { ...item, name: value }
          } else if (field === "quantity") {
            const qty = Number.parseFloat(value) || 0
            const amount = qty * item.rate
            return { ...item, quantity: qty, amount }
          } else if (field === "rate") {
            const rate = Number.parseFloat(value) || 0
            const amount = item.quantity * rate
            return { ...item, rate, amount }
          }
        }
        return item
      }),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      addToast("Please fix the errors below", "error")
      return
    }

    setIsLoading(true)

    try {
      const subtotal = calculateSubtotal()
      const vatAmount = calculateVAT()
      const total = calculateTotal()
      const invoiceNumber = `MGL${Math.floor(Math.random() * 1000000)}`

      const newInvoice = {
        clientName,
        clientEmail,
        clientAddress: clientAddress.trim() || undefined,
        clientAvatar: clientName.substring(0, 2).toUpperCase(),
        amount: subtotal,
        vat: Number.parseFloat(vat) || 0,
        vatAmount,
        total,
        dueDate,
        issuedDate,
        status: "Pending" as const,
        invoiceNumber,
        items,
      }

      await addInvoice(newInvoice)
      addToast(`Invoice ${invoiceNumber} created successfully!`, "success")
      setTimeout(() => router.push("/invoices"), 800)
    } catch (error) {
      console.error("Invoice creation error:", error)
      addToast("Failed to create invoice. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-56">
          <TopBar title="Create New Invoice" />
          <main className="p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Client Information */}
                <Card className="p-6 bg-white rounded-lg border border-border">
                  <h2 className="text-xl font-bold text-foreground mb-6">Client Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Client Name *</label>
                      <Input
                        type="text"
                        placeholder="Enter client name"
                        value={clientName}
                        onChange={(e) => {
                          setClientName(e.target.value)
                          if (errors.clientName) setErrors({ ...errors, clientName: "" })
                        }}
                        className={errors.clientName ? "border-red-500" : ""}
                      />
                      {errors.clientName && <p className="text-xs text-red-500 mt-1">{errors.clientName}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Client Email *</label>
                      <Input
                        type="email"
                        placeholder="client@example.com"
                        value={clientEmail}
                        onChange={(e) => {
                          setClientEmail(e.target.value)
                          if (errors.clientEmail) setErrors({ ...errors, clientEmail: "" })
                        }}
                        className={errors.clientEmail ? "border-red-500" : ""}
                      />
                      {errors.clientEmail && <p className="text-xs text-red-500 mt-1">{errors.clientEmail}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Client Address <span className="text-muted-foreground text-xs">(Optional)</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter client address"
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This will be displayed on the invoice if provided
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Items */}
                <Card className="p-6 bg-white rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Line Items</h2>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-2 text-primary font-medium text-sm hover:underline"
                    >
                      <Plus size={16} />
                      Add Item
                    </button>
                  </div>

                  {items.length > 0 ? (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-end">
                          <div className="flex-1">
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Item Name</label>
                            <Input
                              type="text"
                              placeholder="Product name"
                              value={item.name}
                              onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                            />
                          </div>
                          <div className="w-20">
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Qty</label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                            />
                          </div>
                          <div className="w-24">
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Rate</label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => handleItemChange(item.id, "rate", e.target.value)}
                            />
                          </div>
                          <div className="w-24">
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Amount</label>
                            <Input 
                              type="number" 
                              disabled 
                              value={item.amount.toFixed(2)}
                              className="bg-gray-50"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted-foreground text-sm py-4">No items added yet. Click "Add Item" to begin.</p>
                      {errors.items && <p className="text-xs text-red-500 mt-1">{errors.items}</p>}
                    </div>
                  )}
                </Card>

                {/* Dates */}
                <Card className="p-6 bg-white rounded-lg border border-border">
                  <h2 className="text-xl font-bold text-foreground mb-6">Dates</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Issued Date</label>
                      <Input type="date" value={issuedDate} onChange={(e) => setIssuedDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Due Date *</label>
                      <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => {
                          setDueDate(e.target.value)
                          if (errors.dueDate) setErrors({ ...errors, dueDate: "" })
                        }}
                        className={errors.dueDate ? "border-red-500" : ""}
                      />
                      {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Summary Sidebar - AUTO-CALCULATED */}
              <div className="space-y-6">
                <Card className="p-6 bg-white rounded-lg border border-border sticky top-24">
                  <h2 className="text-lg font-bold text-foreground mb-6">Invoice Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">VAT (%)</label>
                      <Input 
                        type="number" 
                        step="0.1" 
                        value={vat} 
                        onChange={(e) => setVat(e.target.value)}
                        placeholder="Enter VAT percentage"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Default is 5%. Change if needed.
                      </p>
                    </div>
                  </div>

                  {/* AUTO-GENERATED Breakdown */}
                  <div className="space-y-3 border-t border-border pt-4 mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">
                        ₦{calculateSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">VAT ({vat}%)</span>
                      <span className="font-medium text-foreground">
                        ₦{calculateVAT().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t-2 border-primary pt-3 mt-2">
                      <span className="font-bold text-foreground text-base">Total Amount</span>
                      <span className="font-bold text-xl text-primary">
                        ₦{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Info Notice */}
                  {items.length === 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-blue-800">
                        💡 Add line items to see the calculated amounts
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      type="submit"
                      disabled={isLoading || items.length === 0}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </span>
                      ) : (
                        "Create Invoice"
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => router.back()} 
                      className="w-full h-11"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Summary Stats */}
                  {items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground text-center">
                        {items.length} item{items.length !== 1 ? 's' : ''} • Total Qty: {items.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </form>
          </main>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}