"use client"

import * as React from "react"

import { boardService } from "@/services/board.service"
import { SharedBoard } from "@/types/board"

export function useSharedBoards() {
  const [boards, setBoards] = React.useState<SharedBoard[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchSharedBoards = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await boardService.getSharedBoards()
      if (response.success && response.data) {
        setBoards(response.data)
      } else {
        setError(response.message || "Failed to load shared boards")
      }
    } catch (requestError: unknown) {
      const errorMessage = requestError instanceof Error
        ? requestError.message
        : "Failed to load shared boards"
      setError(
        errorMessage
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSharedBoards()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchSharedBoards])

  return {
    boards,
    isLoading,
    error,
    refetch: fetchSharedBoards,
  }
}
