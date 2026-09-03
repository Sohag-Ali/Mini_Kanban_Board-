"use client"

import * as React from "react"
import { toast } from "sonner"

import { boardService } from "@/services/board.service"
import { Board, CreateBoardPayload, UpdateBoardPayload } from "@/types/board"

export function useBoards() {
  const [boards, setBoards] = React.useState<Board[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchBoards = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await boardService.getAllBoards()
      if (response.success && response.data) {
        setBoards(response.data)
      } else {
        setError(response.message || "Failed to load boards")
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Failed to load boards"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  const createBoard = React.useCallback(
    async (payload: CreateBoardPayload) => {
      try {
        const response = await boardService.createBoard(payload)
        if (response.success && response.data) {
          toast.success(response.message || "Board created successfully")
          await fetchBoards()
          return { success: true, data: response.data }
        } else {
          toast.error(response.message || "Failed to create board")
          return { success: false, error: response.message }
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message || err.message || "Failed to create board"
        toast.error(message)
        return { success: false, error: message }
      }
    },
    [fetchBoards]
  )

  const updateBoard = React.useCallback(
    async (id: string, payload: UpdateBoardPayload) => {
      try {
        const response = await boardService.updateBoard(id, payload)
        if (response.success && response.data) {
          toast.success(response.message || "Board updated successfully")
          await fetchBoards()
          return { success: true, data: response.data }
        } else {
          toast.error(response.message || "Failed to update board")
          return { success: false, error: response.message }
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message || err.message || "Failed to update board"
        toast.error(message)
        return { success: false, error: message }
      }
    },
    [fetchBoards]
  )

  const deleteBoard = React.useCallback(
    async (id: string) => {
      try {
        const response = await boardService.deleteBoard(id)
        if (response.success) {
          toast.success(response.message || "Board deleted successfully")
          await fetchBoards()
          return { success: true }
        } else {
          toast.error(response.message || "Failed to delete board")
          return { success: false, error: response.message }
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message || err.message || "Failed to delete board"
        toast.error(message)
        return { success: false, error: message }
      }
    },
    [fetchBoards]
  )

  return {
    boards,
    isLoading,
    error,
    refetch: fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
  }
}
