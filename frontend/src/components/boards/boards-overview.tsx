"use client"

import * as React from "react"
import { KanbanSquare } from "lucide-react"

import { Board } from "@/types/board"
import { useAuth } from "@/hooks/use-auth"
import { useBoards } from "@/hooks/use-boards"
import { useDashboardOverview } from "@/hooks/use-dashboard-overview"
import { BoardCard } from "@/components/boards/board-card"
import { CreateBoardDialog } from "@/components/boards/create-board-dialog"
import { EditBoardDialog } from "@/components/boards/edit-board-dialog"
import { DeleteBoardDialog } from "@/components/boards/delete-board-dialog"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { BoardCardSkeleton } from "@/components/common/loading-skeleton"

interface BoardsOverviewProps {
  filter?: "all" | "owned" | "shared"
  isCreateOpen?: boolean
  setIsCreateOpen?: (open: boolean) => void
}

export function BoardsOverview({
  filter = "all",
  isCreateOpen: externalIsCreateOpen,
  setIsCreateOpen: externalSetIsCreateOpen,
}: BoardsOverviewProps) {
  const { user } = useAuth()
  const { boards, isLoading, error, refetch, createBoard, updateBoard, deleteBoard } = useBoards()
  const [internalIsCreateOpen, setInternalIsCreateOpen] = React.useState(false)
  const isCreateOpen = externalIsCreateOpen !== undefined ? externalIsCreateOpen : internalIsCreateOpen
  const setIsCreateOpen = externalSetIsCreateOpen || setInternalIsCreateOpen

  const [selectedBoard, setSelectedBoard] = React.useState<Board | null>(null)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  const visibleBoards = React.useMemo(() => {
    if (filter === "shared") {
      return boards.filter((board) => board.ownerId !== user?.id)
    }
    if (filter === "owned") {
      return boards.filter((board) => board.ownerId === user?.id)
    }
    return boards
  }, [boards, filter, user?.id])

  // Fetch real column & task counts for visible boards
  const { overview } = useDashboardOverview(visibleBoards)

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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <BoardCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorState title="Failed to load boards" description={error} onRetry={refetch} />
  }

  if (visibleBoards.length === 0) {
    return (
      <>
        <EmptyState
          icon={KanbanSquare}
          title={filter === "shared" ? "No shared boards yet" : "No boards yet"}
          description={
            filter === "shared"
              ? "Boards shared with your account will appear here."
              : "Create your first Kanban board to start organizing your projects, tasks, and workflows."
          }
          actionLabel={filter === "shared" ? undefined : "Create Board"}
          onAction={filter === "shared" ? undefined : () => setIsCreateOpen(true)}
        />

        <CreateBoardDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={createBoard}
        />
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleBoards.map((board) => {
          const stats = overview.boardStats?.[board.id]
          return (
            <BoardCard
              key={board.id}
              board={board}
              currentUserId={user?.id}
              columnCount={stats?.columnCount}
              taskCount={stats?.taskCount}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )
        })}
      </div>

      <CreateBoardDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={createBoard}
      />
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
