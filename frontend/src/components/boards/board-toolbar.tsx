"use client"

import { motion, useReducedMotion } from "motion/react"
import { ArrowUpDown, LayoutGrid, List, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fadeUp } from "@/lib/animations"

export type BoardFilter = "all" | "owned" | "shared"
export type BoardSort = "recent" | "name"
export type BoardView = "grid" | "list"

interface BoardToolbarProps {
  filter: BoardFilter
  sort: BoardSort
  view: BoardView
  total: number
  owned: number
  shared: number
  isRefreshing: boolean
  onFilterChange: (filter: BoardFilter) => void
  onSortChange: (sort: BoardSort) => void
  onViewChange: (view: BoardView) => void
  onRefresh: () => void
}

export function BoardToolbar({
  filter,
  sort,
  view,
  total,
  owned,
  shared,
  isRefreshing,
  onFilterChange,
  onSortChange,
  onViewChange,
  onRefresh,
}: BoardToolbarProps) {
  const reduceMotion = useReducedMotion()
  const filters = [
    { label: "All boards", value: "all" as const, count: total },
    { label: "My boards", value: "owned" as const, count: owned },
    { label: "Shared with me", value: "shared" as const, count: shared },
  ]

  return (
    <motion.div
      className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/60 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between"
      initial="hidden"
      animate="visible"
      variants={reduceMotion ? undefined : fadeUp}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onFilterChange(item.value)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              filter === item.value
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-pressed={filter === item.value}
          >
            {item.label}
            {item.count !== null && <span className={cn("rounded-md px-1.5 py-0.5 text-[10px]", filter === item.value ? "bg-primary-foreground/15" : "bg-muted")}>{item.count}</span>}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="flex h-9 items-center gap-2 rounded-xl border bg-background px-3 text-sm text-muted-foreground">
          <ArrowUpDown className="size-3.5" />
          <span className="sr-only">Sort boards</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as BoardSort)}
            className="bg-transparent text-sm font-medium text-foreground outline-none"
            aria-label="Sort boards"
          >
            <option value="recent">Recently updated</option>
            <option value="name">Name A-Z</option>
          </select>
        </label>
        <div className="hidden items-center rounded-xl border bg-background p-0.5 sm:flex">
          <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon-sm" onClick={() => onViewChange("grid")} aria-label="Grid view"><LayoutGrid /></Button>
          <Button variant={view === "list" ? "secondary" : "ghost"} size="icon-sm" onClick={() => onViewChange("list")} aria-label="List view"><List /></Button>
        </div>
        <Button variant="outline" size="icon" onClick={onRefresh} disabled={isRefreshing} title="Refresh boards" aria-label="Refresh boards">
          <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
        </Button>
      </div>
    </motion.div>
  )
}
