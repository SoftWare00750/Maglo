"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Invoice {
  id: string
  clientName: string
  clientEmail: string
  clientAvatar?: string
  amount: number
  vat: number
  vatAmount: number
  total: number
  dueDate: string
  status: "Paid" | "Unpaid" | "Pending"
  invoiceNumber: string
  issuedDate: string
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  name: string
  quantity: number
  rate: number
  amount: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface MagloContextType {
  user: User | null
  invoices: Invoice[]
  setUser: (user: User | null) => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  getInvoiceById: (id: string) => Invoice | undefined
  getTotalInvoices: () => number
  getTotalPaid: () => number
  getPendingPayments: () => number
  getTotalVAT: () => number
}

const MagloContext = createContext<MagloContextType | undefined>(undefined)

export function MagloProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      clientName: "Gadget Gallery LTD",
      clientEmail: "contact@gadgetgallery.com",
      clientAvatar: "GG",
      amount: 420.84,
      vat: 5,
      vatAmount: 21.04,
      total: 441.88,
      dueDate: "2022-04-14",
      status: "Pending",
      invoiceNumber: "MGL524874",
      issuedDate: "2022-04-14",
    },
    {
      id: "2",
      clientName: "Figma Subscription",
      clientEmail: "billing@figma.com",
      clientAvatar: "FS",
      amount: 244.8,
      vat: 5,
      vatAmount: 12.24,
      total: 257.04,
      dueDate: "2022-04-12",
      status: "Paid",
      invoiceNumber: "MGL524250",
      issuedDate: "2022-04-12",
    },
    {
      id: "3",
      clientName: "Jack Dawson Eric",
      clientEmail: "jack@example.com",
      clientAvatar: "JD",
      amount: 200.0,
      vat: 5,
      vatAmount: 10.0,
      total: 210.0,
      dueDate: "2022-04-12",
      status: "Unpaid",
      invoiceNumber: "MGL524874",
      issuedDate: "2022-04-12",
    },
  ])

  const getTotalInvoices = () => {
    return invoices.reduce((sum, inv) => sum + inv.total, 0)
  }

  const getTotalPaid = () => {
    return invoices.filter((inv) => inv.status === "Paid").reduce((sum, inv) => sum + inv.total, 0)
  }

  const getPendingPayments = () => {
    return invoices
      .filter((inv) => inv.status === "Unpaid" || inv.status === "Pending")
      .reduce((sum, inv) => sum + inv.total, 0)
  }

  const getTotalVAT = () => {
    return invoices.filter((inv) => inv.status === "Paid").reduce((sum, inv) => sum + inv.vatAmount, 0)
  }

  const addInvoice = (invoice: Invoice) => {
    setInvoices([...invoices, invoice])
  }

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)))
  }

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== id))
  }

  const getInvoiceById = (id: string) => {
    return invoices.find((inv) => inv.id === id)
  }

  return (
    <MagloContext.Provider
      value={{
        user,
        invoices,
        setUser,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceById,
        getTotalInvoices,
        getTotalPaid,
        getPendingPayments,
        getTotalVAT,
      }}
    >
      {children}
    </MagloContext.Provider>
  )
}

export function useMaglo() {
  const context = useContext(MagloContext)
  if (!context) {
    throw new Error("useMaglo must be used within MagloProvider")
  }
  return context
} 
