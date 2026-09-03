"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Task } from "@/types/task"
import { TaskCard } from "@/components/tasks/task-card"

interface SortableTaskCardProps {
  task: Task
  columnId: string
  disabled?: boolean
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

export function SortableTaskCard({
  task,
  columnId,
  disabled = false,
  onEdit,
  onDelete,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled,
    data: {
      type: "task",
      task,
      columnId,
    },
  })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(disabled ? {} : attributes)}
      {...(disabled ? {} : listeners)}
      className={disabled ? "" : "touch-none"}
    >
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}
