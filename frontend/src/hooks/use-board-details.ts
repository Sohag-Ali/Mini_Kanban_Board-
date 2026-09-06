"use client"

import * as React from "react"
import { toast } from "sonner"

import { boardService } from "@/services/board.service"
import { columnService } from "@/services/column.service"
import { memberService } from "@/services/member.service"
import { taskService } from "@/services/task.service"
import { Board } from "@/types/board"
import { Column } from "@/types/column"
import { BoardMember } from "@/types/member"
import { Task } from "@/types/task"

export interface ColumnWithTasks extends Column {
  tasks: Task[]
}

export function useBoardDetails(boardId: string) {
  const [board, setBoard] = React.useState<Board | null>(null)
  const [columns, setColumns] = React.useState<ColumnWithTasks[]>([])
  const [members, setMembers] = React.useState<BoardMember[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const isMovingRef = React.useRef<boolean>(false)

  const fetchBoardDetails = React.useCallback(async () => {
    if (!boardId) return

    setIsLoading(true)
    setError(null)

    try {
      // 1. Fetch Board info, Columns, and Members in parallel
      const [boardRes, columnsRes, membersRes] = await Promise.all([
        boardService.getBoardById(boardId).catch((err) => ({ success: false, message: err.message, data: null })),
        columnService.getColumns(boardId).catch((err) => ({ success: false, message: err.message, data: [] })),
        memberService.getMembers(boardId).catch(() => ({ success: false, message: "", data: [] })),
      ])

      if (boardRes.success && boardRes.data) {
        setBoard(boardRes.data)
      } else {
        setError(boardRes.message || "Failed to load board details")
        setIsLoading(false)
        return
      }

      if (membersRes.data) {
        setMembers(membersRes.data)
      }

      const fetchedColumns: Column[] = columnsRes.data || []

      // 2. Fetch tasks for each column in parallel
      if (fetchedColumns.length > 0) {
        const columnsWithTasks = await Promise.all(
          fetchedColumns.map(async (col) => {
            try {
              const tasksRes = await taskService.getTasks(col.id)
              return {
                ...col,
                tasks: (tasksRes.data || []).sort((a, b) => a.position - b.position),
              }
            } catch (_err) {
              return {
                ...col,
                tasks: [],
              }
            }
          })
        )
        setColumns(columnsWithTasks)
      } else {
        setColumns([])
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Failed to load board data"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [boardId])

  React.useEffect(() => {
    fetchBoardDetails()
  }, [fetchBoardDetails])

  const moveTask = React.useCallback(
    async (
      sourceColumnId: string,
      taskId: string,
      targetColumnId: string,
      targetPosition: number
    ): Promise<boolean> => {
      if (isMovingRef.current) return false
      isMovingRef.current = true

      const previousColumns = columns

      // Calculate optimistic updated columns
      const nextColumns = columns.map((col) => {
        if (col.id === sourceColumnId && sourceColumnId === targetColumnId) {
          // Same column move
          const taskToMove = col.tasks.find((t) => t.id === taskId)
          if (!taskToMove) return col

          const filteredTasks = col.tasks.filter((t) => t.id !== taskId)
          const clampedPosition = Math.max(
            0,
            Math.min(targetPosition, filteredTasks.length)
          )

          const reorderedTasks = [
            ...filteredTasks.slice(0, clampedPosition),
            { ...taskToMove, position: clampedPosition },
            ...filteredTasks.slice(clampedPosition),
          ].map((t, idx) => ({ ...t, position: idx }))

          return { ...col, tasks: reorderedTasks }
        }

        if (col.id === sourceColumnId) {
          // Remove from source column
          const filteredTasks = col.tasks
            .filter((t) => t.id !== taskId)
            .map((t, idx) => ({ ...t, position: idx }))
          return { ...col, tasks: filteredTasks }
        }

        if (col.id === targetColumnId) {
          // Find target task from source column
          const sourceCol = columns.find((c) => c.id === sourceColumnId)
          const taskToMove = sourceCol?.tasks.find((t) => t.id === taskId)
          if (!taskToMove) return col

          const clampedPosition = Math.max(
            0,
            Math.min(targetPosition, col.tasks.length)
          )

          const insertedTasks = [
            ...col.tasks.slice(0, clampedPosition),
            { ...taskToMove, columnId: targetColumnId, position: clampedPosition },
            ...col.tasks.slice(clampedPosition),
          ].map((t, idx) => ({ ...t, position: idx }))

          return { ...col, tasks: insertedTasks }
        }

        return col
      })

      // Update state optimistically
      setColumns(nextColumns)

      try {
        const response = await taskService.moveTask(sourceColumnId, taskId, {
          targetColumnId,
          targetPosition,
        })

        if (!response.success) {
          toast.error(response.message || "Failed to move task. Reverting...")
          setColumns(previousColumns)
          await fetchBoardDetails()
          return false
        }

        return true
      } catch (error: any) {
        const message =
          error.response?.data?.message || error.message || "Failed to move task"
        toast.error(`${message}. Reverting...`)
        setColumns(previousColumns)
        await fetchBoardDetails()
        return false
      } finally {
        isMovingRef.current = false
      }
    },
    [columns, fetchBoardDetails]
  )

  return {
    board,
    columns,
    members,
    isLoading,
    error,
    refetch: fetchBoardDetails,
    setColumns,
    moveTask,
  }
}
