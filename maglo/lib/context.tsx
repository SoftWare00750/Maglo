"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { account, databases, ID, DATABASE_ID, INVOICES_COLLECTION_ID } from "./appwrite"
import { Query } from "appwrite"

export interface Invoice {
  id: string
  clientName: string
  clientEmail: string
  clientAvatar?: string
  clientAddress?: string 
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

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Fetch invoices when user changes
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
      console.log('✅ Active session found:', session.$id)
      
      const authenticatedUser = {
        id: session.$id,
        name: session.name,
        email: session.email,
        avatar: session.name.substring(0, 2).toUpperCase(),
      }
      
      setUser(authenticatedUser)
    } catch (error) {
      console.log('ℹ️ No active session')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // Clean up any existing sessions
      console.log('🔐 Initiating login...')
      try {
        const sessions = await account.listSessions()
        if (sessions.sessions.length > 0) {
          console.log('🧹 Cleaning up', sessions.sessions.length, 'existing session(s)')
          for (const session of sessions.sessions) {
            await account.deleteSession(session.$id)
          }
        }
      } catch (error) {
        console.log('ℹ️ No existing sessions to clean')
      }

      // Create new session
      console.log('🔑 Creating session for:', email)
      const session = await account.createEmailPasswordSession(email, password)
      console.log('✅ Session created:', session.$id)
      
      // Get user data
      const userData = await account.get()
      console.log('✅ User data retrieved:', userData.$id)
      
      const authenticatedUser = {
        id: userData.$id,
        name: userData.name,
        email: userData.email,
        avatar: userData.name.substring(0, 2).toUpperCase(),
      }
      
      // Update user state - this will trigger useEffect in sign-in form
      setUser(authenticatedUser)
      console.log('✅ User state updated:', authenticatedUser.email)
      
      // Return successfully - no delay needed here
      return Promise.resolve()
      
    } catch (error: any) {
      console.error('❌ Login error:', error)
      throw new Error(error.message || "Login failed")
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      console.log('📝 Initiating signup...')
      
      // Clean up any existing sessions
      try {
        const sessions = await account.listSessions()
        if (sessions.sessions.length > 0) {
          console.log('🧹 Cleaning up existing sessions')
          for (const session of sessions.sessions) {
            await account.deleteSession(session.$id)
          }
        }
      } catch (error) {
        console.log('ℹ️ No existing sessions')
      }

      // Create account
      console.log('🆕 Creating account for:', email)
      await account.create(ID.unique(), email, password, name)
      console.log('✅ Account created')
      
      // Auto-login
      console.log('🔐 Logging in new user...')
      const session = await account.createEmailPasswordSession(email, password)
      console.log('✅ Session created:', session.$id)
      
      // Get user data
      const userData = await account.get()
      const authenticatedUser = {
        id: userData.$id,
        name: userData.name,
        email: userData.email,
        avatar: userData.name.substring(0, 2).toUpperCase(),
      }
      
      // Update user state
      setUser(authenticatedUser)
      console.log('✅ User registered and logged in:', authenticatedUser.email)
      
      return Promise.resolve()
      
    } catch (error: any) {
      console.error('❌ Signup error:', error)
      throw new Error(error.message || "Signup failed")
    }
  }

  const logout = async () => {
  try {
    console.log('🚪 Logging out...')
    await account.deleteSession("current")
    
    // Clear all Appwrite cookies explicitly
    document.cookie.split(";").forEach((c) => {
      const cookieName = c.trim().split("=")[0]
      if (cookieName.startsWith('a_session_')) {
        document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;'
      }
    })
    
    setUser(null)
    setInvoices([])
    console.log('✅ Logged out successfully')
  } catch (error: any) {
    console.error('❌ Logout error:', error)
    throw new Error(error.message || "Logout failed")
  }
}
  const fetchInvoices = async () => {
    if (!user) return

    try {
      console.log('📄 Fetching invoices for user:', user.id)
      
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
      console.log('✅ Loaded', fetchedInvoices.length, 'invoice(s)')
    } catch (error) {
      console.error('❌ Failed to fetch invoices:', error)
    }
  }

  const addInvoice = async (invoice: Omit<Invoice, "id">) => {
    if (!user) throw new Error("User not authenticated")

    try {
      console.log('➕ Creating invoice:', invoice.invoiceNumber)
      
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
      console.log('✅ Invoice created:', newInvoice.invoiceNumber)
    } catch (error: any) {
      console.error('❌ Add invoice error:', error)
      throw new Error(error.message || "Failed to create invoice")
    }
  }

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    if (!user) throw new Error("User not authenticated")

    try {
      console.log('✏️ Updating invoice:', id)
      
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
      console.log('✅ Invoice updated')
    } catch (error: any) {
      console.error('❌ Update invoice error:', error)
      throw new Error(error.message || "Failed to update invoice")
    }
  }

  const deleteInvoice = async (id: string) => {
    if (!user) throw new Error("User not authenticated")

    try {
      console.log('🗑️ Deleting invoice:', id)
      
      await databases.deleteDocument(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        id
      )

      setInvoices(invoices.filter((inv) => inv.id !== id))
      console.log('✅ Invoice deleted')
    } catch (error: any) {
      console.error('❌ Delete invoice error:', error)
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