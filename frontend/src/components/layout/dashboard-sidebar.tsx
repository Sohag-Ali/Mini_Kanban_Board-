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
    <aside className="flex h-full w-64 flex-col border-r border-border/70 bg-card/80 shadow-xl shadow-slate-950/5 backdrop-blur-xl dark:bg-slate-950/75">
      <div className="flex h-16 items-center gap-3 border-b border-border/70 px-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-primary-foreground shadow-lg shadow-primary/20">
          <Kanban className="size-4" />
        </span>
        <span className="font-semibold tracking-tight">Mini Kanban</span>
      </div>
      <nav aria-label="Application navigation" className="flex-1 space-y-1 p-4">
        {applicationNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-gradient-to-r from-primary/15 to-violet-500/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn("size-4 transition-transform group-hover:scale-110", isActive && "text-primary")} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border/70 px-5 py-4 text-xs text-muted-foreground">
        Organize work. Keep moving.
      </div>
    </aside>
  )
}
