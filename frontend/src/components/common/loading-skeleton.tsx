"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function BoardCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 rounded-xl border border-border/40 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-1/2 rounded-md" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-4 w-1/3 rounded-md" />
      <div className="pt-6">
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function ColumnCardSkeleton() {
  return (
    <div className="flex w-72 flex-shrink-0 flex-col space-y-3 rounded-xl border border-border/40 bg-muted/40 p-3">
      <div className="flex items-center justify-between pb-2">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-4 w-6 rounded-full" />
      </div>
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-3 w-36 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  )
}

export function BoardDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex h-16 items-center justify-between border-b border-border/40 px-4 sm:px-6">
        <Skeleton className="h-6 w-40 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <div className="flex gap-4 p-6 overflow-x-auto">
        <ColumnCardSkeleton />
        <ColumnCardSkeleton />
        <ColumnCardSkeleton />
      </div>
    </div>
  )
}
