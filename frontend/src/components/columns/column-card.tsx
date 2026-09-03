"use client"

import * as React from "react"
import { ColumnWithTasks } from "@/hooks/use-board-details"
import { TaskCard } from "@/components/tasks/task-card"
import { Badge } from "@/components/ui/badge"

interface ColumnCardProps {
  column: ColumnWithTasks
}

export function ColumnCard({ column }: ColumnCardProps) {
  return (
    <div className="flex w-72 flex-shrink-0 flex-col rounded-xl border border-border/40 bg-muted/40 p-3 shadow-xs max-h-[calc(100vh-160px)]">
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 pb-3 pt-1">
        <h3 className="font-bold text-sm tracking-tight text-foreground line-clamp-1">
          {column.name}
        </h3>
        <Badge
          variant="secondary"
          className="rounded-full text-[11px] font-semibold px-2 py-0"
        >
          {column.tasks.length}
        </Badge>
      </div>

      {/* Task List Container */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
        {column.tasks.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border/60 p-3 text-center">
            <span className="text-xs text-muted-foreground">No tasks</span>
          </div>
        ) : (
          column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
