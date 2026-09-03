"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ShieldAlert } from "lucide-react"

import { Board } from "@/types/board"
import { Column } from "@/types/column"
import { BoardMember } from "@/types/member"
import { Task } from "@/types/task"
import { useAuth } from "@/hooks/use-auth"
import { ColumnWithTasks, useBoardDetails } from "@/hooks/use-board-details"
import { useBoardPermissions } from "@/hooks/use-board-permissions"
import { useBoards } from "@/hooks/use-boards"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { BoardHeader } from "@/components/boards/board-header"
import { EditBoardDialog } from "@/components/boards/edit-board-dialog"
import { DeleteBoardDialog } from "@/components/boards/delete-board-dialog"
import { ColumnList } from "@/components/columns/column-list"
import { CreateColumnDialog } from "@/components/columns/create-column-dialog"
import { EditColumnDialog } from "@/components/columns/edit-column-dialog"
import { DeleteColumnDialog } from "@/components/columns/delete-column-dialog"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog"
import { MemberList } from "@/components/members/member-list"
import { AddMemberDialog } from "@/components/members/add-member-dialog"
import { RemoveMemberDialog } from "@/components/members/remove-member-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function BoardDetailContent() {
  const params = useParams()
  const router = useRouter()
  const boardId = params.boardId as string

  const { user } = useAuth()
  const { board, columns, members, isLoading, error, refetch, moveTask } =
    useBoardDetails(boardId)
  const { updateBoard, deleteBoard } = useBoards()

  // Role permissions
  const permissions = useBoardPermissions(board, members, user?.id)

  // Board Dialog States
  const [isEditBoardOpen, setIsEditBoardOpen] = React.useState(false)
  const [isDeleteBoardOpen, setIsDeleteBoardOpen] = React.useState(false)
  const [selectedBoard, setSelectedBoard] = React.useState<Board | null>(null)

  // Column Dialog States
  const [isCreateColumnOpen, setIsCreateColumnOpen] = React.useState(false)
  const [isEditColumnOpen, setIsEditColumnOpen] = React.useState(false)
  const [isDeleteColumnOpen, setIsDeleteColumnOpen] = React.useState(false)
  const [selectedColumn, setSelectedColumn] = React.useState<Column | null>(null)

  // Task Dialog States
  const [isCreateTaskOpen, setIsCreateTaskOpen] = React.useState(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = React.useState(false)
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = React.useState(false)
  const [targetColumnId, setTargetColumnId] = React.useState<string>("")
  const [targetColumnName, setTargetColumnName] = React.useState<string>("")
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)

  // Member Dialog States
  const [isMembersOpen, setIsMembersOpen] = React.useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false)
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = React.useState(false)
  const [selectedMemberToRemove, setSelectedMemberToRemove] =
    React.useState<BoardMember | null>(null)

  // Handlers for Board actions
  const handleEditBoard = React.useCallback((targetBoard: Board) => {
    setSelectedBoard(targetBoard)
    setIsEditBoardOpen(true)
  }, [])

  const handleDeleteBoard = React.useCallback((targetBoard: Board) => {
    setSelectedBoard(targetBoard)
    setIsDeleteBoardOpen(true)
  }, [])

  const handleConfirmDeleteBoard = React.useCallback(
    async (id: string) => {
      const res = await deleteBoard(id)
      if (res.success) {
        router.push("/dashboard")
      }
      return res
    },
    [deleteBoard, router]
  )

  // Handlers for Column actions
  const handleEditColumn = React.useCallback((targetColumn: Column) => {
    setSelectedColumn(targetColumn)
    setIsEditColumnOpen(true)
  }, [])

  const handleDeleteColumn = React.useCallback((targetColumn: Column) => {
    setSelectedColumn(targetColumn)
    setIsDeleteColumnOpen(true)
  }, [])

  // Handlers for Task actions
  const handleAddTask = React.useCallback((col: ColumnWithTasks) => {
    setTargetColumnId(col.id)
    setTargetColumnName(col.name)
    setIsCreateTaskOpen(true)
  }, [])

  const handleEditTask = React.useCallback((columnId: string, task: Task) => {
    setTargetColumnId(columnId)
    setSelectedTask(task)
    setIsEditTaskOpen(true)
  }, [])

  const handleDeleteTask = React.useCallback((columnId: string, task: Task) => {
    setTargetColumnId(columnId)
    setSelectedTask(task)
    setIsDeleteTaskOpen(true)
  }, [])

  // Handlers for Member actions
  const handleRemoveMemberClick = React.useCallback((member: BoardMember) => {
    setSelectedMemberToRemove(member)
    setIsRemoveMemberOpen(true)
  }, [])

  if (error && !board) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-md">
          <ShieldAlert className="h-10 w-10 text-destructive mb-3" />
          <h2 className="text-xl font-bold">Board Not Found</h2>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="mt-5"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Composition */}
      {board && (
        <BoardHeader
          board={board}
          members={members}
          currentUserId={user?.id}
          isRefreshing={isLoading}
          onRefresh={refetch}
          onEditBoard={permissions.canEditBoard ? handleEditBoard : undefined}
          onDeleteBoard={permissions.canDeleteBoard ? handleDeleteBoard : undefined}
          onManageMembers={() => setIsMembersOpen(true)}
        />
      )}

      {/* Main Board View Container */}
      <main className="container mx-auto flex-1 px-4 py-6 sm:px-6">
        <ColumnList
          columns={columns}
          permissions={permissions}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          onAddColumn={() => setIsCreateColumnOpen(true)}
          onEditColumn={handleEditColumn}
          onDeleteColumn={handleDeleteColumn}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onMoveTask={moveTask}
        />
      </main>

      {/* Board Dialogs */}
      {permissions.canEditBoard && (
        <EditBoardDialog
          board={selectedBoard}
          open={isEditBoardOpen}
          onOpenChange={setIsEditBoardOpen}
          onSubmit={async (id, payload) => {
            const res = await updateBoard(id, payload)
            if (res.success) refetch()
            return res
          }}
        />
      )}

      {permissions.canDeleteBoard && (
        <DeleteBoardDialog
          board={selectedBoard}
          open={isDeleteBoardOpen}
          onOpenChange={setIsDeleteBoardOpen}
          onConfirm={handleConfirmDeleteBoard}
        />
      )}

      {/* Column Dialogs */}
      {permissions.canCreateColumn && (
        <CreateColumnDialog
          boardId={boardId}
          open={isCreateColumnOpen}
          onOpenChange={setIsCreateColumnOpen}
          onSuccess={refetch}
        />
      )}

      {permissions.canEditColumn && (
        <EditColumnDialog
          boardId={boardId}
          column={selectedColumn}
          open={isEditColumnOpen}
          onOpenChange={setIsEditColumnOpen}
          onSuccess={refetch}
        />
      )}

      {permissions.canDeleteColumn && (
        <DeleteColumnDialog
          boardId={boardId}
          column={selectedColumn}
          open={isDeleteColumnOpen}
          onOpenChange={setIsDeleteColumnOpen}
          onSuccess={refetch}
        />
      )}

      {/* Task Dialogs */}
      {permissions.canCreateTask && (
        <CreateTaskDialog
          columnId={targetColumnId}
          columnName={targetColumnName}
          open={isCreateTaskOpen}
          onOpenChange={setIsCreateTaskOpen}
          onSuccess={refetch}
        />
      )}

      {permissions.canEditTask && (
        <EditTaskDialog
          columnId={targetColumnId}
          task={selectedTask}
          open={isEditTaskOpen}
          onOpenChange={setIsEditTaskOpen}
          onSuccess={refetch}
        />
      )}

      {permissions.canDeleteTask && (
        <DeleteTaskDialog
          columnId={targetColumnId}
          task={selectedTask}
          open={isDeleteTaskOpen}
          onOpenChange={setIsDeleteTaskOpen}
          onSuccess={refetch}
        />
      )}

      {/* Member Management Modal */}
      {board && (
        <Dialog open={isMembersOpen} onOpenChange={setIsMembersOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="sr-only">
              <DialogTitle>Board Members</DialogTitle>
            </DialogHeader>
            <MemberList
              boardId={boardId}
              ownerId={board.ownerId}
              members={members}
              currentUserId={user?.id}
              isLoading={isLoading}
              error={error}
              onRefresh={refetch}
              onAddMemberClick={() => setIsAddMemberOpen(true)}
              onRemoveMemberClick={handleRemoveMemberClick}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Add & Remove Member Dialogs */}
      {permissions.canManageMembers && (
        <>
          <AddMemberDialog
            boardId={boardId}
            open={isAddMemberOpen}
            onOpenChange={setIsAddMemberOpen}
            onSuccess={refetch}
          />

          <RemoveMemberDialog
            boardId={boardId}
            member={selectedMemberToRemove}
            open={isRemoveMemberOpen}
            onOpenChange={setIsRemoveMemberOpen}
            onSuccess={refetch}
          />
        </>
      )}
    </div>
  )
}

export default function BoardDetailPage() {
  return (
    <ProtectedRoute>
      <BoardDetailContent />
    </ProtectedRoute>
  )
}
