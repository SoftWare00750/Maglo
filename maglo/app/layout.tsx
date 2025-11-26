import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { MagloProvider } from "@/lib/context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Maglo - Finance & Invoice Management",
  description: "Manage invoices, track payments, and monitor VAT with Maglo - Your complete finance management solution",
  keywords: ["invoice", "finance", "VAT", "payment tracking", "business management"],
  authors: [{ name: "Maglo Team" }],
  icons: {
    icon: [
      { url: "/logo2.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/logo2.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Maglo - Finance & Invoice Management",
    description: "Manage invoices, track payments, and monitor VAT with ease",
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <MagloProvider>{children}</MagloProvider>
        <Analytics />
      </body>
    </html>
  )
}