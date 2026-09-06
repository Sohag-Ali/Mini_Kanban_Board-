"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import {
  ArrowLeft,
  Kanban,
  MoreVertical,
  Pencil,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react"

import { Board } from "@/types/board"
import { BoardMember } from "@/types/member"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fadeUp } from "@/lib/animations"

interface BoardHeaderProps {
  board: Board
  members?: BoardMember[]
  currentUserId?: string
  isRefreshing?: boolean
  onRefresh?: () => void
  onEditBoard?: (board: Board) => void
  onDeleteBoard?: (board: Board) => void
  onManageMembers?: () => void
}

export function BoardHeader({
  board,
  members = [],
  currentUserId,
  isRefreshing = false,
  onRefresh,
  onEditBoard,
  onDeleteBoard,
  onManageMembers,
}: BoardHeaderProps) {
  const reduceMotion = useReducedMotion()
  const isOwner = currentUserId ? board.ownerId === currentUserId : true

  // Find user's member role
  const userMembership = currentUserId
    ? members.find((m) => m.userId === currentUserId)
    : undefined

  const userRole = isOwner ? "OWNER" : userMembership?.role || "VIEWER"

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={reduceMotion ? undefined : fadeUp}
      className="sticky top-0 z-30 border-b border-border/70 bg-background/80 shadow-sm backdrop-blur-xl"
    >
      <div className="container mx-auto flex min-h-20 items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Left Section: Back link & Board Title */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>

          <div className="h-4 w-px bg-border/60" />

          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 text-primary ring-1 ring-primary/20">
              <Kanban className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:block">Current board</p>
              <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">{board.name}</h1>
            </div>
            <Badge
              variant={isOwner ? "default" : "secondary"}
              className="rounded-md text-[10px] uppercase tracking-wider"
            >
              {userRole}
            </Badge>
          </div>
        </div>

        {/* Right Section: Members Button & Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh board data"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="sr-only">Refresh</span>
            </Button>
          )}

          {/* Members Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onManageMembers}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Members</span>
            <Badge variant="secondary" className="ml-0.5 rounded-full px-1.5 py-0 text-[10px]">
              {members.length > 0 ? members.length : 1}
            </Badge>
          </Button>

          {/* Board Actions Dropdown */}
          {(onEditBoard || onDeleteBoard) && (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-lg border border-border/40 p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Board actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {onEditBoard && (
                  <DropdownMenuItem
                    onClick={() => onEditBoard(board)}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit Board Name</span>
                  </DropdownMenuItem>
                )}
                {isOwner && onDeleteBoard && (
                  <DropdownMenuItem
                    onClick={() => onDeleteBoard(board)}
                    className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Board</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </motion.header>
  )
}
