"use client"

import * as React from "react"
import { Kanban, LogOut, Plus, RefreshCw, User as UserIcon } from "lucide-react"

import { Board } from "@/types/board"
import { useAuth } from "@/hooks/use-auth"
import { useBoards } from "@/hooks/use-boards"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { BoardList } from "@/components/boards/board-list"
import { CreateBoardDialog } from "@/components/boards/create-board-dialog"
import { EditBoardDialog } from "@/components/boards/edit-board-dialog"
import { DeleteBoardDialog } from "@/components/boards/delete-board-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function DashboardContent() {
  const { user, logout } = useAuth()
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

  const handleEditClick = React.useCallback((board: Board) => {
    setSelectedBoard(board)
    setIsEditOpen(true)
  }, [])

  const handleDeleteClick = React.useCallback((board: Board) => {
    setSelectedBoard(board)
    setIsDeleteOpen(true)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-card/60 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Kanban className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Mini Kanban</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-xs sm:flex">
              <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium text-foreground">{user?.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6">
        <div className="space-y-8">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Your Boards
                </h1>
                <Badge variant="secondary" className="rounded-full px-2.5">
                  {boards.length}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your personal and collaborative Kanban boards
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={isLoading}
                title="Refresh boards"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="sr-only">Refresh</span>
              </Button>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="gap-2 font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Create Board</span>
              </Button>
            </div>
          </div>

          {/* Board Grid List */}
          <BoardList
            boards={boards}
            currentUserId={user?.id}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            onCreateClick={() => setIsCreateOpen(true)}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </main>

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
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
