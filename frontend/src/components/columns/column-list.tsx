"use client"

import * as React from "react"
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Columns3, Plus } from "lucide-react"

import { ColumnWithTasks } from "@/hooks/use-board-details"
import { BoardPermissions } from "@/hooks/use-board-permissions"
import { Column as ColumnType } from "@/types/column"
import { Task } from "@/types/task"
import { Column } from "@/components/columns/column"
import { TaskCard } from "@/components/tasks/task-card"
import { ErrorState } from "@/components/common/error-state"
import { EmptyState } from "@/components/common/empty-state"
import { ColumnCardSkeleton } from "@/components/common/loading-skeleton"
import { Button } from "@/components/ui/button"

interface ColumnListProps {
  columns: ColumnWithTasks[]
  permissions?: BoardPermissions
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onAddColumn: () => void
  onEditColumn: (column: ColumnType) => void
  onDeleteColumn: (column: ColumnType) => void
  onAddTask: (column: ColumnWithTasks) => void
  onEditTask: (columnId: string, task: Task) => void
  onDeleteTask: (columnId: string, task: Task) => void
  onMoveTask: (
    sourceColumnId: string,
    taskId: string,
    targetColumnId: string,
    targetPosition: number
  ) => Promise<boolean>
}

export function ColumnList({
  columns,
  permissions,
  isLoading,
  error,
  onRetry,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}: ColumnListProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)

  const canCreateColumn = permissions ? permissions.canCreateColumn : true
  const canEditColumn = permissions ? permissions.canEditColumn : true
  const canDeleteColumn = permissions ? permissions.canDeleteColumn : true
  const canCreateTask = permissions ? permissions.canCreateTask : true
  const canEditTask = permissions ? permissions.canEditTask : true
  const canDeleteTask = permissions ? permissions.canDeleteTask : true
  const canMoveTask = permissions ? permissions.canMoveTask : true

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      if (!canMoveTask) return
      const { active } = event
      const task = active.data.current?.task as Task | undefined
      if (task) {
        setActiveTask(task)
      }
    },
    [canMoveTask]
  )

  const handleDragEnd = React.useCallback(
    async (event: DragEndEvent) => {
      if (!canMoveTask) return
      const { active, over } = event
      setActiveTask(null)

      if (!over || !active) return

      const activeTaskId = active.id as string
      const sourceColumnId = active.data.current?.columnId as string | undefined
      if (!sourceColumnId) return

      let targetColumnId: string | undefined
      let targetIndex = 0

      // Case A: Dropped onto a Column container
      if (over.data.current?.type === "column" || columns.some((c) => c.id === over.id)) {
        targetColumnId = (over.data.current?.columnId || over.id) as string
        const targetColumn = columns.find((c) => c.id === targetColumnId)
        targetIndex = targetColumn ? targetColumn.tasks.length : 0
      }
      // Case B: Dropped onto another Task
      else if (over.data.current?.type === "task") {
        targetColumnId = over.data.current.columnId as string
        const targetColumn = columns.find((c) => c.id === targetColumnId)

        if (targetColumn) {
          const overIndex = targetColumn.tasks.findIndex((t) => t.id === over.id)
          if (sourceColumnId === targetColumnId) {
            const activeIndex = targetColumn.tasks.findIndex((t) => t.id === activeTaskId)
            if (activeIndex === overIndex) return
            targetIndex = overIndex >= 0 ? overIndex : targetColumn.tasks.length
          } else {
            targetIndex = overIndex >= 0 ? overIndex : targetColumn.tasks.length
          }
        }
      }

      if (!targetColumnId) return

      await onMoveTask(sourceColumnId, activeTaskId, targetColumnId, targetIndex)
    },
    [canMoveTask, columns, onMoveTask]
  )

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flex flex-row gap-4 overflow-x-auto p-1 pb-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ColumnCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorState
        title="Failed to load columns"
        description={error}
        onRetry={onRetry}
      />
    )
  }

  // Sort columns explicitly by position ASC
  const sortedColumns = [...columns].sort((a, b) => a.position - b.position)

  // 3. Empty State
  if (sortedColumns.length === 0) {
    return (
      <EmptyState
        icon={Columns3}
        title="No columns in this board"
        description={
          canCreateColumn
            ? "Get started by adding your first column to organize tasks."
            : "No columns have been created for this board yet."
        }
        actionLabel={canCreateColumn ? "Add Column" : undefined}
        onAction={canCreateColumn ? onAddColumn : undefined}
      />
    )
  }

  // 4. Columns DndContext Horizontal Track
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col space-y-4">
        {/* Column Toolbar */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Columns ({sortedColumns.length})
          </span>
          {canCreateColumn && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddColumn}
              className="gap-2 text-xs font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Column</span>
            </Button>
          )}
        </div>

        {/* Horizontal Track */}
        <div className="flex flex-row items-start gap-4 overflow-x-auto p-1 pb-4">
          {sortedColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              canEditColumn={canEditColumn}
              canDeleteColumn={canDeleteColumn}
              canCreateTask={canCreateTask}
              canEditTask={canEditTask}
              canDeleteTask={canDeleteTask}
              canMoveTask={canMoveTask}
              onEditColumn={onEditColumn}
              onDeleteColumn={onDeleteColumn}
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}

          {/* Quick Add Column Button at end of track */}
          {canCreateColumn && (
            <button
              onClick={onAddColumn}
              className="flex h-12 w-72 flex-shrink-0 items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-muted/20 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              <span>Add Column</span>
            </button>
          )}
        </div>
      </div>

      {/* Drag Overlay for active task */}
      <DragOverlay>
        {activeTask && canMoveTask ? (
          <div className="w-72 shadow-2xl rotate-2 cursor-grabbing">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
