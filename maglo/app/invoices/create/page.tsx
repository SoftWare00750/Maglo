"use client"

import type React from "react"

import { useState } from "react"
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
  const [amount, setAmount] = useState("")
  const [vat, setVat] = useState("5")
  const [dueDate, setDueDate] = useState("")
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().split("T")[0])
  const [items, setItems] = useState<FormItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const calculateVAT = () => {
    const amountNum = Number.parseFloat(amount) || 0
    const vatPercent = Number.parseFloat(vat) || 0
    return (amountNum * vatPercent) / 100
  }

  const calculateTotal = () => {
    const amountNum = Number.parseFloat(amount) || 0
    return amountNum + calculateVAT()
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

    if (!amount || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0"
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

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updated.amount = (updated.quantity || 0) * (updated.rate || 0)
          }
          return updated
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
      const amountNum = Number.parseFloat(amount)
      const vatAmount = calculateVAT()
      const total = calculateTotal()
      const invoiceNumber = `MGL${Math.floor(Math.random() * 1000000)}`

      const newInvoice = {
        id: Date.now().toString(),
        clientName,
        clientEmail,
        clientAvatar: clientName.substring(0, 2).toUpperCase(),
        amount: amountNum,
        vat: Number.parseFloat(vat),
        vatAmount,
        total,
        dueDate,
        issuedDate,
        status: "Pending" as const,
        invoiceNumber,
        items,
      }

      addInvoice(newInvoice)
      addToast(`Invoice ${invoiceNumber} created successfully!`, "success")
      setTimeout(() => router.push("/invoices"), 800)
    } catch (error) {
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
                              onChange={(e) => handleItemChange(item.id, "quantity", Number.parseFloat(e.target.value))}
                            />
                          </div>
                          <div className="w-24">
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Rate</label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => handleItemChange(item.id, "rate", Number.parseFloat(e.target.value))}
                            />
                          </div>
                          <div className="w-24">
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Amount</label>
                            <Input type="number" disabled value={item.amount.toFixed(2)} />
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
                    <p className="text-muted-foreground text-sm py-4">No items added yet</p>
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

              {/* Summary Sidebar */}
              <div className="space-y-6">
                {/* Amount & VAT */}
                <Card className="p-6 bg-white rounded-lg border border-border sticky top-24">
                  <h2 className="text-lg font-bold text-foreground mb-6">Invoice Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Amount *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">₦</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value)
                            if (errors.amount) setErrors({ ...errors, amount: "" })
                          }}
                          className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">VAT (%)</label>
                      <Input type="number" step="0.1" value={vat} onChange={(e) => setVat(e.target.value)} />
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-2 border-t border-border pt-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₦{Number.parseFloat(amount || "0").toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">VAT Amount</span>
                      <span className="font-medium">₦{calculateVAT().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-bold text-lg">₦{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isLoading ? "Creating..." : "Create Invoice"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">
                      Cancel
                    </Button>
                  </div>
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