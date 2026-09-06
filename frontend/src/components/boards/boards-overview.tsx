"use client"

import * as React from "react"
import { FolderKanban } from "lucide-react"

import { Board } from "@/types/board"
import { useAuth } from "@/hooks/use-auth"
import { useBoards } from "@/hooks/use-boards"
import { BoardCard } from "@/components/boards/board-card"
import { EditBoardDialog } from "@/components/boards/edit-board-dialog"
import { DeleteBoardDialog } from "@/components/boards/delete-board-dialog"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { BoardCardSkeleton } from "@/components/common/loading-skeleton"

export function BoardsOverview({ filter = "all" }: { filter?: "all" | "owned" | "shared" }) {
  const { user } = useAuth()
  const { boards, isLoading, error, refetch, updateBoard, deleteBoard } = useBoards()
  const [selectedBoard, setSelectedBoard] = React.useState<Board | null>(null)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  const handleEdit = React.useCallback((board: Board) => {
    setSelectedBoard(board)
    setIsEditOpen(true)
  }, [])

  const handleDelete = React.useCallback((board: Board) => {
    setSelectedBoard(board)
    setIsDeleteOpen(true)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <BoardCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorState title="Failed to load boards" description={error} onRetry={refetch} />
  }

  const visibleBoards = filter === "shared"
    ? boards.filter((board) => board.ownerId !== user?.id)
    : filter === "owned"
      ? boards.filter((board) => board.ownerId === user?.id)
      : boards

  if (visibleBoards.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title={filter === "shared" ? "No shared boards yet" : "No boards yet"}
        description={filter === "shared" ? "Boards shared with your account will appear here." : "Your owned boards will appear here."}
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleBoards.map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            currentUserId={user?.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <EditBoardDialog
        board={selectedBoard}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={updateBoard}
      />
      <DeleteBoardDialog
        board={selectedBoard}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={deleteBoard}
      />
    </>
  )
}
