"use client"

import * as React from "react"
import { LogOut, Menu } from "lucide-react"

import { ThemeToggle } from "@/components/common/theme-toggle"
import { UserMenu } from "@/components/layout/user-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 bg-background/75 px-4 shadow-sm backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu />
        </Button>
        <div>
          <p className="text-sm font-semibold">Workspace</p>
          <p className="hidden text-xs text-muted-foreground sm:block">Plan, prioritize, and ship</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="gap-2"
          aria-label="Logout"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}
