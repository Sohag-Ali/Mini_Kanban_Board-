"use client"

import Link from "next/link"
import { Kanban } from "lucide-react"
import { usePathname } from "next/navigation"

import { applicationNavigation } from "@/constants/navigation"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  onNavigate?: () => void
}

export function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Kanban className="size-4" />
        </span>
        <span className="font-semibold tracking-tight">Mini Kanban</span>
      </div>
      <nav aria-label="Application navigation" className="flex-1 space-y-1 p-3">
        {applicationNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t px-5 py-4 text-xs text-muted-foreground">
        Organize work. Keep moving.
      </div>
    </aside>
  )
}
