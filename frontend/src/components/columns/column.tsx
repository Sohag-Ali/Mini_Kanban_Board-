"use client"

import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react"

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

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 flex-shrink-0 flex-col rounded-xl border bg-muted/40 p-3 shadow-xs max-h-[calc(100vh-170px)] transition-colors ${
        isOver && canMoveTask ? "border-primary/60 bg-muted/60" : "border-border/40"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 pb-3 pt-1">
        <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-1">
          {canCreateTask && onAddTask && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onAddTask(column)}
              title="Add task"
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add task</span>
            </Button>
          )}

          {hasColumnActions && (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none">
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
        <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto pr-1 min-h-[60px]">
          {column.tasks.length === 0 ? (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border/60 p-3 text-center">
              <span className="text-xs text-muted-foreground">No tasks</span>
            </div>
          ) : (
            column.tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                columnId={column.id}
                disabled={!canMoveTask}
                onEdit={canEditTask && onEditTask ? (t) => onEditTask(column.id, t) : undefined}
                onDelete={canDeleteTask && onDeleteTask ? (t) => onDeleteTask(column.id, t) : undefined}
              />
            ))
          )}
        </div>
      </SortableContext>

      {/* Bottom Add Task Button */}
      {canCreateTask && onAddTask && (
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddTask(column)}
            className="w-full justify-start text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Task</span>
          </Button>
        </div>
      )}
    </div>
  )
}
