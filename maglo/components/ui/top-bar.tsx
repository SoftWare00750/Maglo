"use client"

import { useMaglo } from "@/lib/context"
import { Search, Bell, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TopBarProps {
  title?: string
}

export default function TopBar({ title }: TopBarProps) {
  const { user } = useMaglo()

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-6">
        {/* Page Title */}
        {title && (
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">{title}</h1>
        )}
        
        {/* Spacer to push icons to the right */}
        <div className="flex-1"></div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          {/* Search Icon - Hidden on mobile */}
          <button className="hidden sm:block p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Search size={20} className="text-gray-600" strokeWidth={2} />
          </button>

          {/* Notification Bell */}
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative">
            <Bell size={18} className="sm:hidden text-gray-600" strokeWidth={2} />
            <Bell size={22} className="hidden sm:block text-gray-600" strokeWidth={2} />
            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile - Simplified on mobile */}
          <button className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 text-gray-700 font-semibold">
              <AvatarFallback>{user?.avatar || "MN"}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-semibold text-gray-900 truncate max-w-[120px] lg:max-w-none">
              {user?.name || "Mahfuzul Nabil"}
            </span>
            <ChevronDown size={16} className="hidden sm:block text-gray-600" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}