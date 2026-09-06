"use client"

import * as React from "react"

import { Board } from "@/types/board"
import { useAuth } from "@/hooks/use-auth"
import { useBoards } from "@/hooks/use-boards"
import { useDashboardOverview } from "@/hooks/use-dashboard-overview"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { CreateBoardDialog } from "@/components/boards/create-board-dialog"
import { EditBoardDialog } from "@/components/boards/edit-board-dialog"
import { DeleteBoardDialog } from "@/components/boards/delete-board-dialog"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

function DashboardContent() {
  const { user } = useAuth()
  const { boards, createBoard, updateBoard, deleteBoard } = useBoards()
  const { overview, isLoading: isOverviewLoading } = useDashboardOverview(boards)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedBoard, setSelectedBoard] = React.useState<Board | null>(null)

  const handleEdit = React.useCallback((board: Board) => {
    setSelectedBoard(board)
    setIsEditOpen(true)
  }, [])

  const handleDelete = React.useCallback((board: Board) => {
    setSelectedBoard(board)
    setIsDeleteOpen(true)
  }, [])

  return (
    <DashboardLayout>
      <DashboardOverview
        userName={user?.name}
        currentUserId={user?.id}
        boards={boards}
        overview={overview}
        isLoading={isOverviewLoading}
        onCreateBoard={() => setIsCreateOpen(true)}
        onEditBoard={handleEdit}
        onDeleteBoard={handleDelete}
      />

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
