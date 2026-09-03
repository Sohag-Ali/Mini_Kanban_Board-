"use client"

import * as React from "react"
import { toast } from "sonner"

import { memberService } from "@/services/member.service"
import { BoardMember } from "@/types/member"
import { ConfirmDialog } from "@/components/common/confirm-dialog"

interface RemoveMemberDialogProps {
  boardId: string
  member: BoardMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function RemoveMemberDialog({
  boardId,
  member,
  open,
  onOpenChange,
  onSuccess,
}: RemoveMemberDialogProps) {
  const [isRemoving, setIsRemoving] = React.useState(false)

  async function handleRemove() {
    if (!boardId || !member) return
    setIsRemoving(true)
    try {
      const response = await memberService.removeMember(boardId, member.userId)
      if (response.success) {
        toast.success(response.message || "Member removed successfully")
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(response.message || "Failed to remove member")
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to remove member"
      toast.error(message)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Remove Member"
      description={
        <>
          Are you sure you want to remove{" "}
          <span className="font-semibold text-foreground">
            {member?.user?.name || member?.user?.email}
          </span>{" "}
          from this board? They will lose access to all columns and tasks.
        </>
      }
      confirmLabel="Remove Member"
      variant="destructive"
      isLoading={isRemoving}
      onConfirm={handleRemove}
    />
  )
}
