"use client"

import * as React from "react"
import { toast } from "sonner"

import { taskService } from "@/services/task.service"
import { Task } from "@/types/task"
import { ConfirmDialog } from "@/components/common/confirm-dialog"

interface DeleteTaskDialogProps {
  columnId: string
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteTaskDialog({
  columnId,
  task,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  async function handleDelete() {
    if (!columnId || !task) return
    setIsDeleting(true)
    try {
      const response = await taskService.deleteTask(columnId, task.id)
      if (response.success) {
        toast.success(response.message || "Task deleted successfully")
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(response.message || "Failed to delete task")
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to delete task"
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Task"
      description={
        <>
          Are you sure you want to delete the task{" "}
          <span className="font-semibold text-foreground">
            &quot;{task?.title}&quot;
          </span>
          ? This action cannot be undone.
        </>
      }
      confirmLabel="Delete Task"
      variant="destructive"
      isLoading={isDeleting}
      onConfirm={handleDelete}
    />
  )
}
