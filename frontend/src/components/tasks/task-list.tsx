"use client"

import * as React from "react"
import { Task } from "@/types/task"
import { TaskCard } from "@/components/tasks/task-card"

interface TaskListProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}

export function TaskList({
  tasks,
  onEditTask,
  onDeleteTask,
}: TaskListProps) {
  // Sort tasks explicitly by position ASC
  const sortedTasks = React.useMemo(() => {
    return [...tasks].sort((a, b) => a.position - b.position)
  }, [tasks])

  if (sortedTasks.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border/60 p-3 text-center">
        <span className="text-xs text-muted-foreground">No tasks</span>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
      {sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  )
}
