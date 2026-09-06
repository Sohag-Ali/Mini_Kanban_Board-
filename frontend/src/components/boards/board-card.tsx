"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, Clock, MoreVertical, Pencil, Trash2, Sparkles } from "lucide-react"

import { Board, SharedBoard } from "@/types/board"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
}

export function BoardCard({
  board,
  currentUserId,
  onEdit,
  onDelete,
  memberRole,
  ownerName,
}: BoardCardProps) {
  const reduceMotion = useReducedMotion()
  const isOwner = currentUserId ? board.ownerId === currentUserId : true
  const accentClasses = [
    "from-indigo-500/20 via-violet-500/10 to-transparent",
    "from-cyan-500/20 via-teal-500/10 to-transparent",
    "from-amber-500/20 via-orange-500/10 to-transparent",
    "from-pink-500/20 via-rose-500/10 to-transparent",
  ]
  const accentIndex = Array.from(board.id).reduce((sum, character) => sum + character.charCodeAt(0), 0) % accentClasses.length
  const createdDate = new Date(board.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={reduceMotion ? undefined : fadeUp}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="group relative flex h-full min-h-[250px] flex-col justify-between overflow-hidden rounded-2xl border-border/70 bg-card/80 shadow-sm backdrop-blur transition-shadow hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
        <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-br", accentClasses[accentIndex])} />
        <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-background/70 text-primary shadow-sm ring-1 ring-border/60">
            <Sparkles className="size-4" />
          </div>
          <CardTitle className="line-clamp-1 text-lg font-semibold tracking-tight">{board.name}</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            <span>Created {createdDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Badge
            variant={isOwner ? "default" : "secondary"}
            className="text-[10px] font-medium uppercase tracking-wider"
          >
            {memberRole || (isOwner ? "Owner" : "Shared")}
          </Badge>

          {isOwner && (onEdit || onDelete) && <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {isOwner && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(board)} className="gap-2">
                  <Pencil className="h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              )}
              {isOwner && onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(board)}
                  className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>}
        </div>
      </CardHeader>

      <CardContent className="relative flex-1 pt-4">
        <div className="rounded-xl border border-border/60 bg-background/40 px-3 py-2.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{isOwner ? "Personal workspace" : "Collaborative workspace"}</span>
          <span className="mx-2 text-border">•</span>
          {ownerName ? `Shared by ${ownerName}` : "Board activity is available inside the workspace"}
        </div>
      </CardContent>

      <CardFooter className="relative border-t-0 bg-transparent pt-2">
        <Link href={`/boards/${board.id}`} className="w-full">
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-between rounded-xl transition-all group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <span>Open Board</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
      </Card>
    </motion.div>
  )
}
