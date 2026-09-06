"use client"

import { FolderKanban } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { useBoards } from "@/hooks/use-boards"
import { BoardCard } from "@/components/boards/board-card"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { BoardCardSkeleton } from "@/components/common/loading-skeleton"

export function BoardsOverview() {
  const { user } = useAuth()
  const { boards, isLoading, error, refetch } = useBoards()

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

  if (boards.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No boards yet"
        description="Your accessible boards will appear here."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} currentUserId={user?.id} />
      ))}
    </div>
  )
}
