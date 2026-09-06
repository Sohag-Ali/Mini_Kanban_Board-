"use client"

import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { motion, useReducedMotion } from "motion/react"
import { CheckCircle2, Layers3, MoreVertical, Pencil, Plus, Target, Trash2, Zap } from "lucide-react"

import { ColumnWithTasks } from "@/hooks/use-board-details"
import { Column as ColumnType } from "@/types/column"
import { Task } from "@/types/task"
import { SortableTaskCard } from "@/components/tasks/sortable-task-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fadeUp } from "@/lib/animations"
import { cn } from "@/lib/utils"

interface ColumnProps {
  column: ColumnWithTasks
  canEditColumn?: boolean
  canDeleteColumn?: boolean
  canCreateTask?: boolean
  canEditTask?: boolean
  canDeleteTask?: boolean
  canMoveTask?: boolean
  onEditColumn?: (column: ColumnType) => void
  onDeleteColumn?: (column: ColumnType) => void
  onAddTask?: (column: ColumnWithTasks) => void
  onEditTask?: (columnId: string, task: Task) => void
  onDeleteTask?: (columnId: string, task: Task) => void
}

export function Column({
  column,
  canEditColumn = true,
  canDeleteColumn = true,
  canCreateTask = true,
  canEditTask = true,
  canDeleteTask = true,
  canMoveTask = true,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: ColumnProps) {
  const reduceMotion = useReducedMotion()
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    disabled: !canMoveTask,
    data: {
      type: "column",
      columnId: column.id,
    },
  })

  const taskIds = React.useMemo(
    () => column.tasks.map((task) => task.id),
    [column.tasks]
  )

  const hasColumnActions =
    (canEditColumn && onEditColumn) || (canDeleteColumn && onDeleteColumn)
  const accentOptions = [
    { gradient: "from-violet-500/20 via-fuchsia-500/10", border: "border-violet-500/25", icon: Target, iconClass: "bg-violet-500/15 text-violet-500" },
    { gradient: "from-amber-500/20 via-orange-500/10", border: "border-amber-500/25", icon: Zap, iconClass: "bg-amber-500/15 text-amber-500" },
    { gradient: "from-cyan-500/20 via-emerald-500/10", border: "border-cyan-500/25", icon: CheckCircle2, iconClass: "bg-cyan-500/15 text-cyan-500" },
    { gradient: "from-blue-500/20 via-indigo-500/10", border: "border-blue-500/25", icon: Layers3, iconClass: "bg-blue-500/15 text-blue-500" },
  ]
  const accent = accentOptions[Array.from(column.id).reduce((sum, char) => sum + char.charCodeAt(0), 0) % accentOptions.length]
  const ColumnIcon = accent.icon

  return (
    <motion.div
      ref={setNodeRef}
      initial="hidden"
      animate="visible"
      variants={reduceMotion ? undefined : fadeUp}
      className={cn(
        "relative flex h-[min(680px,calc(100vh-185px))] w-80 flex-shrink-0 flex-col overflow-hidden rounded-2xl border bg-card/75 p-3 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition-colors",
        accent.border,
        isOver && canMoveTask && "border-primary/70 bg-primary/5 shadow-primary/20"
      )}
    >
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br to-transparent", accent.gradient)} />
      {/* Column Header */}
      <div className="relative flex items-center justify-between px-1 pb-4 pt-1">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", accent.iconClass)}>
            <ColumnIcon className="size-4" />
          </span>
          <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
            {column.name}
          </h3>
          <Badge
            variant="secondary"
            className="rounded-md bg-background/70 px-2 py-0 text-[11px] font-semibold"
          >
            {column.tasks.length}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {canCreateTask && onAddTask && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onAddTask(column)}
              title="Add task"
              className="text-muted-foreground hover:bg-background/70 hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add task</span>
            </Button>
          )}

          {hasColumnActions && (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground focus:outline-none">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Column menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {canEditColumn && onEditColumn && (
                  <DropdownMenuItem
                    onClick={() => onEditColumn(column)}
                    className="gap-2 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit Column</span>
                  </DropdownMenuItem>
                )}
                {canDeleteColumn && onDeleteColumn && (
                  <DropdownMenuItem
                    onClick={() => onDeleteColumn(column)}
                    className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Column</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Task List / Sortable Context */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-[60px] flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {column.tasks.length === 0 ? (
            <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-background/20 p-3 text-center">
              <span className={cn("flex size-8 items-center justify-center rounded-full", accent.iconClass)}><span className="size-2 rounded-full bg-current" /></span>
              <span className="mt-2 text-xs font-medium text-foreground">No tasks</span>
              <span className="mt-1 text-[11px] text-muted-foreground">Add a task to get started</span>
            </div>
          ) : (
            column.tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? undefined : { duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
              >
                <SortableTaskCard
                  task={task}
                  columnId={column.id}
                  disabled={!canMoveTask}
                  onEdit={canEditTask && onEditTask ? (t) => onEditTask(column.id, t) : undefined}
                  onDelete={canDeleteTask && onDeleteTask ? (t) => onDeleteTask(column.id, t) : undefined}
                />
              </motion.div>
            ))
          )}
        </div>
      </SortableContext>

      {/* Bottom Add Task Button */}
      {canCreateTask && onAddTask && (
        <div className="relative pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddTask(column)}
            className="w-full justify-start gap-2 rounded-xl border border-dashed border-border/70 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Task</span>
          </Button>
        </div>
      )}
    </motion.div>
  )
}
