"use client"

import * as React from "react"

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="inset-y-0 left-0 top-0 h-full max-w-72 translate-x-0 translate-y-0 gap-0 rounded-none p-0 sm:max-w-72"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Application navigation</DialogTitle>
        <DashboardSidebar onNavigate={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
