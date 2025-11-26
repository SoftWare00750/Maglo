

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { account, databases, ID, DATABASE_ID, INVOICES_COLLECTION_ID } from "./appwrite"
import { Query } from "appwrite"

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
  isLoading: boolean
  setUser: (user: User | null) => void
  addInvoice: (invoice: Omit<Invoice, "id">) => Promise<void>
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>
  deleteInvoice: (id: string) => Promise<void>
  getInvoiceById: (id: string) => Invoice | undefined
  getTotalInvoices: () => number
  getTotalPaid: () => number
  getPendingPayments: () => number
  getTotalVAT: () => number
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const MagloContext = createContext<MagloContextType | undefined>(undefined)

export function MagloProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchInvoices()
    } else {
      setInvoices([])
    }
  }, [user])

  const checkAuth = async () => {
    try {
      const session = await account.get()
      setUser({
        id: session.$id,
        name: session.name,
        email: session.email,
        avatar: session.name.substring(0, 2).toUpperCase(),
      })
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // FIXED: Delete any existing sessions first
      try {
        await account.deleteSession("current")
      } catch (error) {
        // Ignore if no session exists
        console.log("No existing session to delete")
      }

      // Now create new session
      await account.createEmailPasswordSession(email, password)
      
      // Get user data and update state immediately
      const session = await account.get()
      setUser({
        id: session.$id,
        name: session.name,
        email: session.email,
        avatar: session.name.substring(0, 2).toUpperCase(),
      })
    } catch (error: any) {
      console.error("Login error:", error)
      throw new Error(error.message || "Login failed")
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      // FIXED: Delete any existing sessions first
      try {
        await account.deleteSession("current")
      } catch (error) {
        // Ignore if no session exists
        console.log("No existing session to delete")
      }

      // Create new account
      await account.create(ID.unique(), email, password, name)
      
      // Login with new account
      await account.createEmailPasswordSession(email, password)
      
      // Get user data and update state immediately
      const session = await account.get()
      setUser({
        id: session.$id,
        name: session.name,
        email: session.email,
        avatar: session.name.substring(0, 2).toUpperCase(),
      })
    } catch (error: any) {
      console.error("Signup error:", error)
      throw new Error(error.message || "Signup failed")
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession("current")
      setUser(null)
      setInvoices([])
    } catch (error: any) {
      console.error("Logout error:", error)
      throw new Error(error.message || "Logout failed")
    }
  }

  const fetchInvoices = async () => {
    if (!user) return

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        [Query.equal("userId", user.id), Query.orderDesc("$createdAt")]
      )

      const fetchedInvoices = response.documents.map((doc: any) => ({
        id: doc.$id,
        clientName: doc.clientName,
        clientEmail: doc.clientEmail,
        clientAvatar: doc.clientAvatar || doc.clientName.substring(0, 2).toUpperCase(),
        amount: doc.amount,
        vat: doc.vat,
        vatAmount: doc.vatAmount,
        total: doc.total,
        dueDate: doc.dueDate,
        issuedDate: doc.issuedDate,
        status: doc.status,
        invoiceNumber: doc.invoiceNumber,
        items: doc.items ? JSON.parse(doc.items) : [],
      }))

      setInvoices(fetchedInvoices)
    } catch (error) {
      console.error("Failed to fetch invoices:", error)
    }
  }

  const addInvoice = async (invoice: Omit<Invoice, "id">) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const docData = {
        ...invoice,
        userId: user.id,
        items: invoice.items ? JSON.stringify(invoice.items) : "[]",
      }

      const response = await databases.createDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        ID.unique(),
        docData
      )

      const newInvoice: Invoice = {
        id: response.$id,
        ...invoice,
      }

      setInvoices([newInvoice, ...invoices])
    } catch (error: any) {
      console.error("Add invoice error:", error)
      throw new Error(error.message || "Failed to create invoice")
    }
  }

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const updateData: any = { ...updates }
      if (updates.items) {
        updateData.items = JSON.stringify(updates.items)
      }

      await databases.updateDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        id,
        updateData
      )

      setInvoices(
        invoices.map((inv) =>
          inv.id === id ? { ...inv, ...updates } : inv
        )
      )
    } catch (error: any) {
      console.error("Update invoice error:", error)
      throw new Error(error.message || "Failed to update invoice")
    }
  }

  const deleteInvoice = async (id: string) => {
    if (!user) throw new Error("User not authenticated")

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        id
      )

      setInvoices(invoices.filter((inv) => inv.id !== id))
    } catch (error: any) {
      console.error("Delete invoice error:", error)
      throw new Error(error.message || "Failed to delete invoice")
    }
  }

  const getInvoiceById = (id: string) => {
    return invoices.find((inv) => inv.id === id)
  }

  const getTotalInvoices = () => {
    return invoices.reduce((sum, inv) => sum + inv.total, 0)
  }

  const getTotalPaid = () => {
    return invoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.total, 0)
  }

  const getPendingPayments = () => {
    return invoices
      .filter((inv) => inv.status === "Unpaid" || inv.status === "Pending")
      .reduce((sum, inv) => sum + inv.total, 0)
  }

  const getTotalVAT = () => {
    return invoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.vatAmount, 0)
  }

  return (
    <MagloContext.Provider
      value={{
        user,
        invoices,
        isLoading,
        setUser,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceById,
        getTotalInvoices,
        getTotalPaid,
        getPendingPayments,
        getTotalVAT,
        login,
        signup,
        logout,
        checkAuth,
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