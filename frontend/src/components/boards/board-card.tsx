"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"
import {
  ArrowRight,
  CheckSquare2,
  Clock,
  KanbanSquare,
  MoreVertical,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react"

import { Board, SharedBoard } from "@/types/board"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fadeUp } from "@/lib/animations"
import { cn } from "@/lib/utils"

interface BoardCardProps {
  board: Board
  currentUserId?: string
  onEdit?: (board: Board) => void
  onDelete?: (board: Board) => void
  memberRole?: SharedBoard["role"]
  ownerName?: string
  columnCount?: number
  taskCount?: number
}

const accentGradients = [
  "from-indigo-500/20 via-violet-500/10 to-transparent",
  "from-cyan-500/20 via-teal-500/10 to-transparent",
  "from-amber-500/20 via-orange-500/10 to-transparent",
  "from-pink-500/20 via-rose-500/10 to-transparent",
  "from-emerald-500/20 via-teal-500/10 to-transparent",
  "from-blue-500/20 via-sky-500/10 to-transparent",
]

export function BoardCard({
  board,
  currentUserId,
  onEdit,
  onDelete,
  memberRole,
  ownerName,
  columnCount,
  taskCount,
}: BoardCardProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const isOwner = currentUserId ? board.ownerId === currentUserId : true

  const accentIndex = React.useMemo(() => {
    return (
      Array.from(board.id).reduce(
        (sum, character) => sum + character.charCodeAt(0),
        0
      ) % accentGradients.length
    )
  }, [board.id])

  const updatedDate = React.useMemo(() => {
    if (!board.updatedAt && !board.createdAt) return null
    const dateSource = board.updatedAt || board.createdAt
    return new Date(dateSource).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }, [board.updatedAt, board.createdAt])

  const handleCardClick = () => {
    router.push(`/boards/${board.id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      router.push(`/boards/${board.id}`)
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={reduceMotion ? undefined : fadeUp}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.008 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        className="group relative flex h-full min-h-[220px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-slate-800/80 dark:bg-slate-900/65 dark:hover:border-primary/50"
      >
        {/* Subtle colorful top accent */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br opacity-80 transition-opacity group-hover:opacity-100",
            accentGradients[accentIndex]
          )}
        />

        {/* Card Header */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background/80 text-primary shadow-sm ring-1 ring-border/60">
                <Sparkles className="size-4" />
              </span>
              <h3 className="truncate text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {board.name}
              </h3>
            </div>
          </div>

          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Badge
              variant={isOwner ? "default" : "secondary"}
              className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5"
            >
              {memberRole || (isOwner ? "Owner" : "Shared")}
            </Badge>

            {isOwner && (onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  aria-label={`Actions for ${board.name}`}
                >
                  <MoreVertical className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(board)
                      }}
                      className="gap-2 cursor-pointer"
                    >
                      <Pencil className="size-3.5" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(board)
                      }}
                      className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Card Body - Real Data Only */}
        <div className="relative z-10 my-4 flex-1 space-y-3">
          {/* Metadata badges for column & task counts if available */}
          {(columnCount !== undefined || taskCount !== undefined) && (
            <div className="flex flex-wrap items-center gap-2">
              {columnCount !== undefined && (
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground">
                  <KanbanSquare className="size-3.5 text-primary" />
                  <span>
                    {columnCount} {columnCount === 1 ? "column" : "columns"}
                  </span>
                </div>
              )}
              {taskCount !== undefined && (
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground">
                  <CheckSquare2 className="size-3.5 text-emerald-500" />
                  <span>
                    {taskCount} {taskCount === 1 ? "task" : "tasks"}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Ownership details if shared */}
          {ownerName && !isOwner && (
            <p className="text-xs text-muted-foreground truncate">
              Shared by <span className="font-medium text-foreground">{ownerName}</span>
            </p>
          )}
        </div>

        {/* Card Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
          {updatedDate ? (
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>Updated {updatedDate}</span>
            </div>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
            <span>Open</span>
            <ArrowRight className="size-3.5" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
