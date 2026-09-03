"use client"

import * as React from "react"
import { toast } from "sonner"

import { columnService } from "@/services/column.service"
import { Column } from "@/types/column"
import { ConfirmDialog } from "@/components/common/confirm-dialog"

interface DeleteColumnDialogProps {
  boardId: string
  column: Column | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteColumnDialog({
  boardId,
  column,
  open,
  onOpenChange,
  onSuccess,
}: DeleteColumnDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  async function handleDelete() {
    if (!boardId || !column) return
    setIsDeleting(true)
    try {
      const response = await columnService.deleteColumn(boardId, column.id)
      if (response.success) {
        toast.success(response.message || "Column deleted successfully")
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(response.message || "Failed to delete column")
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to delete column"
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Column"
      description={
        <>
          Are you sure you want to delete the column{" "}
          <span className="font-semibold text-foreground">
            &quot;{column?.name}&quot;
          </span>
          ?
        </>
      }
      confirmLabel="Delete Column"
      variant="destructive"
      isLoading={isDeleting}
      onConfirm={handleDelete}
    />
  )
}
