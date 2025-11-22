                                                                                                                                                                                                                                                                                                                                                                                                                                                                 "use client"


import { useMaglo } from "@/lib/context"
import { Search, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function TopBar() {
  const { user, setUser } = useMaglo()
  const router = useRouter()

  const handleLogout = () => {
    setUser(null)
    router.push("/")
  }

  return (
    <div className="border-b border-border bg-background sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative hidden md:flex">
            <Search size={20} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notification */}
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Bell size={20} className="text-muted-foreground" />
          </button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-3 hover:bg-secondary px-3 py-2 rounded-lg transition-colors">
                <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                  <AvatarFallback>{user?.avatar || "U"}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
