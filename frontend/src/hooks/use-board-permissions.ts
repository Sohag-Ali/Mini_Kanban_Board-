"use client"

import * as React from "react"
import { Board } from "@/types/board"
import { BoardMember, BoardRole } from "@/types/member"

export interface BoardPermissions {
  userRole: BoardRole
  isOwner: boolean
  isEditor: boolean
  isViewer: boolean

  // Board level
  canEditBoard: boolean
  canDeleteBoard: boolean

  // Member management
  canManageMembers: boolean

  // Column level
  canCreateColumn: boolean
  canEditColumn: boolean
  canDeleteColumn: boolean

  // Task level
  canCreateTask: boolean
  canEditTask: boolean
  canDeleteTask: boolean
  canMoveTask: boolean
}

export function useBoardPermissions(
  board: Board | null,
  members: BoardMember[] = [],
  currentUserId?: string
): BoardPermissions {
  return React.useMemo(() => {
    if (!board || !currentUserId) {
      return {
        userRole: "VIEWER",
        isOwner: false,
        isEditor: false,
        isViewer: true,
        canEditBoard: false,
        canDeleteBoard: false,
        canManageMembers: false,
        canCreateColumn: false,
        canEditColumn: false,
        canDeleteColumn: false,
        canCreateTask: false,
        canEditTask: false,
        canDeleteTask: false,
        canMoveTask: false,
      }
    }

    const isOwner = board.ownerId === currentUserId
    const userMembership = !isOwner
      ? members.find((m) => m.userId === currentUserId)
      : undefined

    const userRole: BoardRole = isOwner
      ? "OWNER"
      : userMembership?.role || "VIEWER"

    const isEditor = userRole === "OWNER" || userRole === "EDITOR"
    const isViewer = userRole === "VIEWER"

    return {
      userRole,
      isOwner,
      isEditor,
      isViewer,

      // Board level
      canEditBoard: isOwner,
      canDeleteBoard: isOwner,

      // Member management
      canManageMembers: isOwner,

      // Column level
      canCreateColumn: isEditor,
      canEditColumn: isEditor,
      canDeleteColumn: isEditor,

      // Task level
      canCreateTask: isEditor,
      canEditTask: isEditor,
      canDeleteTask: isEditor,
      canMoveTask: isEditor,
    }
  }, [board, members, currentUserId])
}
