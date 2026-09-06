"use client"

import * as React from "react"

import { Board } from "@/types/board"
import { useAuth } from "@/hooks/use-auth"
import { useBoards } from "@/hooks/use-boards"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { BoardCard } from "@/components/boards/board-card"
import { BoardPageHeader } from "@/components/boards/board-page-header"
import { BoardStats } from "@/components/boards/board-stats"
import { BoardToolbar, type BoardFilter, type BoardSort, type BoardView } from "@/components/boards/board-toolbar"
import { CreateBoardDialog } from "@/components/boards/create-board-dialog"
import { CreateBoardCard } from "@/components/boards/create-board-card"
import { EditBoardDialog } from "@/components/boards/edit-board-dialog"
import { DeleteBoardDialog } from "@/components/boards/delete-board-dialog"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { BoardCardSkeleton } from "@/components/common/loading-skeleton"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

function DashboardContent() {
  const { user } = useAuth()
  const {
    boards,
    isLoading,
    error,
    refetch,
    createBoard,
    updateBoard,
    deleteBoard,
  } = useBoards()

  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedBoard, setSelectedBoard] = React.useState<Board | null>(null)
  const [filter, setFilter] = React.useState<BoardFilter>("all")
  const [sort, setSort] = React.useState<BoardSort>("recent")
  const [view, setView] = React.useState<BoardView>("grid")
  const ownedBoards = boards.filter((board) => board.ownerId === user?.id)
  const sharedBoards = boards.filter((board) => board.ownerId !== user?.id)

  const handleEditClick = React.useCallback((board: Board) => {
    setSelectedBoard(board)
    setIsEditOpen(true)
  }, [])

  const handleDeleteClick = React.useCallback((board: Board) => {
    setSelectedBoard(board)
    setIsDeleteOpen(true)
  }, [])

  const visibleBoards = React.useMemo(() => {
    const filtered = boards.filter((board) => {
      if (filter === "shared") return board.ownerId !== user?.id
      if (filter === "owned") return board.ownerId === user?.id
      return true
    })

    return [...filtered].sort((first, second) => {
      if (sort === "name") return first.name.localeCompare(second.name)
      return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
    })
  }, [boards, filter, sort, user?.id])

  return (
    <DashboardLayout>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_10%_0%,_color-mix(in_oklch,var(--primary)_16%,transparent),_transparent_35%),radial-gradient(circle_at_90%_0%,_color-mix(in_oklch,var(--chart-2)_12%,transparent),_transparent_32%)]" />
        <div className="container relative mx-auto space-y-8 px-4 py-8 sm:px-6 lg:py-10">
          <BoardPageHeader userName={user?.name} onCreate={() => setIsCreateOpen(true)} />
          <BoardStats total={boards.length} owned={ownedBoards.length} shared={sharedBoards.length} />
          <BoardToolbar
            filter={filter}
            sort={sort}
            view={view}
            total={boards.length}
            owned={ownedBoards.length}
            shared={sharedBoards.length}
            isRefreshing={isLoading}
            onFilterChange={setFilter}
            onSortChange={setSort}
            onViewChange={setView}
            onRefresh={refetch}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <BoardCardSkeleton key={index} />)}
            </div>
          ) : error ? (
            <ErrorState title="Failed to load boards" description={error} onRetry={refetch} />
          ) : visibleBoards.length === 0 ? (
            <EmptyState
              title={filter === "shared" ? "No shared boards available" : "No boards yet"}
              description={filter === "shared" ? "Boards shared with your account will appear here." : "Create your first Kanban board and start organizing your work."}
              actionLabel={filter === "shared" ? undefined : "Create board"}
              onAction={filter === "shared" ? undefined : () => setIsCreateOpen(true)}
            />
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" : "grid grid-cols-1 gap-4"}>
              {visibleBoards.map((board) => (
                <BoardCard key={board.id} board={board} currentUserId={user?.id} onEdit={handleEditClick} onDelete={handleDeleteClick} />
              ))}
              {view === "grid" && <CreateBoardCard onCreate={() => setIsCreateOpen(true)} />}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
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
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
