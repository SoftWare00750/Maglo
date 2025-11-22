"use client"

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import type { Toast } from "@/lib/toast"

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const colors = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-lg border ${colors[toast.type]} animate-in fade-in slide-in-from-bottom-4 duration-300`}
          >
            <Icon size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button onClick={() => onRemove(toast.id)} className="flex-shrink-0 hover:opacity-70 transition-opacity">
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
