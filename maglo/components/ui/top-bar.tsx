// components/ui/top-bar.tsx
"use client"

import { useMaglo } from "@/lib/context"
import { useMobileNav } from "@/lib/use-mobile-nav"
import { Search, Bell, ChevronDown, Menu } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TopBarProps {
  title?: string
}

export default function TopBar({ title }: TopBarProps) {
  const { user } = useMaglo()
  const { toggleMobileMenu } = useMobileNav()

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        {/* Page Title */}
        {title && (
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground truncate flex-1 lg:flex-initial">
            {title}
          </h1>
        )}
        
        {/* Spacer to push icons to the right - only on desktop */}
        <div className="hidden lg:block flex-1"></div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
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

          {/* User Profile */}
          <button className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 text-gray-700 font-semibold">
              <AvatarFallback>{user?.avatar || "MN"}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-semibold text-gray-900 truncate max-w-[80px] md:max-w-[120px] lg:max-w-none">
              {user?.name || "Mahfuzul Nabil"}
            </span>
            <ChevronDown size={16} className="hidden sm:block text-gray-600" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}