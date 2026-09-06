import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, Settings, UserRound, UsersRound, KanbanSquare } from "lucide-react"

export interface NavigationItem {
  label: string
  href: string
  icon: LucideIcon
}

export const applicationNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Boards", href: "/dashboard/boards", icon: KanbanSquare },
  { label: "Shared Boards", href: "/dashboard/shared", icon: UsersRound },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Settings", href: "/settings", icon: Settings },
]
