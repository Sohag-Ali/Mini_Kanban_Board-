"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Clock, MoreVertical, Pencil, Trash2 } from "lucide-react"

import { Board } from "@/types/board"
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

interface BoardCardProps {
  board: Board
  currentUserId?: string
  onEdit?: (board: Board) => void
  onDelete?: (board: Board) => void
}

export function BoardCard({
  board,
  currentUserId,
  onEdit,
  onDelete,
}: BoardCardProps) {
  const isOwner = currentUserId ? board.ownerId === currentUserId : true
  const createdDate = new Date(board.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card className="group relative flex flex-col justify-between border-border/40 bg-card/60 backdrop-blur-sm transition-all hover:border-border hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="line-clamp-1 text-lg font-bold tracking-tight">
            {board.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Created {createdDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Badge
            variant={isOwner ? "default" : "secondary"}
            className="text-[10px] font-medium uppercase tracking-wider"
          >
            {isOwner ? "Owner" : "Shared"}
          </Badge>

          {(onEdit || (isOwner && onDelete)) && <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onEdit && (
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

      <CardContent className="pt-4">
        {/* Placeholder for board summary stats */}
      </CardContent>

      <CardFooter className="pt-2">
        <Link href={`/boards/${board.id}`} className="w-full">
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            <span>Open Board</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
