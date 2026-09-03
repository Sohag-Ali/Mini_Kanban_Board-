"use client"

import * as React from "react"
import { FolderKanban } from "lucide-react"

import { Board } from "@/types/board"
import { BoardCard } from "@/components/boards/board-card"
import { ErrorState } from "@/components/common/error-state"
import { EmptyState } from "@/components/common/empty-state"
import { BoardCardSkeleton } from "@/components/common/loading-skeleton"

interface BoardListProps {
  boards: Board[]
  currentUserId?: string
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onCreateClick: () => void
  onEdit: (board: Board) => void
  onDelete: (board: Board) => void
}

export function BoardList({
  boards,
  currentUserId,
  isLoading,
  error,
  onRetry,
  onCreateClick,
  onEdit,
  onDelete,
}: BoardListProps) {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <BoardCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorState
        title="Failed to load boards"
        description={error}
        onRetry={onRetry}
      />
    )
  }

  // 3. Empty State
  if (boards.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No boards yet"
        description="Get started by creating your first Kanban board to organize your tasks efficiently."
        actionLabel="Create Board"
        onAction={onCreateClick}
      />
    )
  }

  // 4. Board Grid
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
