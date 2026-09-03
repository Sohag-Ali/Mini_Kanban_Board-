"use client"

import * as React from "react"
import { Board } from "@/types/board"
import { ConfirmDialog } from "@/components/common/confirm-dialog"

interface DeleteBoardDialogProps {
  board: Board | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string) => Promise<{ success: boolean; error?: string }>
}

export function DeleteBoardDialog({
  board,
  open,
  onOpenChange,
  onConfirm,
}: DeleteBoardDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  async function handleDelete() {
    if (!board) return
    setIsDeleting(true)
    const result = await onConfirm(board.id)
    setIsDeleting(false)
    if (result.success) {
      onOpenChange(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Board"
      description={
        <>
          This action cannot be undone. This will permanently delete the board{" "}
          <span className="font-semibold text-foreground">
            &quot;{board?.name}&quot;
          </span>{" "}
          and all of its columns and tasks.
        </>
      }
      confirmLabel="Delete Board"
      variant="destructive"
      isLoading={isDeleting}
      onConfirm={handleDelete}
    />
  )
}
