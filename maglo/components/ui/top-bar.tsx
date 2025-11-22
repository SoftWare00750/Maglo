"use client"

import { useMaglo } from "@/lib/context"
import { Search, Bell, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TopBar() {
  const { user } = useMaglo()

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-end gap-6">
        {/* Search Icon */}
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Search size={22} className="text-gray-600" strokeWidth={2} />
        </button>

        {/* Notification Bell */}
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative">
          <Bell size={22} className="text-gray-600" strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
          <Avatar className="w-10 h-10 bg-gray-200 text-gray-700 font-semibold">
            <AvatarFallback>{user?.avatar || "MN"}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-gray-900">{user?.name || "Mahfuzul Nabil"}</span>
          <ChevronDown size={18} className="text-gray-600" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}