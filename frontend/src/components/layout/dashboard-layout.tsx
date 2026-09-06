"use client"

import * as React from "react"

import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <DashboardSidebar />
      </div>
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
      <div className="lg:pl-64">
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} />
        <main>{children}</main>
      </div>
    </div>
  )
}
