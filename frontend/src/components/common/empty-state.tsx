"use client"

import * as React from "react"
import { FolderKanban, LucideIcon, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: LucideIcon
  className?: string
}

export function EmptyState({
  icon: Icon = FolderKanban,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon = Plus,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border/60 p-8 text-center bg-card/20 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5 gap-2 font-medium">
          <ActionIcon className="h-4 w-4" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  )
}
