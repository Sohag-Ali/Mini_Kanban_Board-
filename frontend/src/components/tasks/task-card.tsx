"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { CalendarDays, Circle, MoreVertical, Pencil, Trash2 } from "lucide-react"

import { Task } from "@/types/task"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  isDragging?: boolean
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

export function TaskCard({ task, isDragging = false, onEdit, onDelete }: TaskCardProps) {
  const reduceMotion = useReducedMotion()
  const accents = [
    { glow: "from-violet-500/20 via-fuchsia-500/8", border: "border-l-violet-400/80", icon: "text-violet-400", surface: "bg-violet-500/10" },
    { glow: "from-amber-500/20 via-orange-500/8", border: "border-l-amber-400/80", icon: "text-amber-400", surface: "bg-amber-500/10" },
    { glow: "from-cyan-500/20 via-emerald-500/8", border: "border-l-cyan-400/80", icon: "text-cyan-400", surface: "bg-cyan-500/10" },
    { glow: "from-blue-500/20 via-indigo-500/8", border: "border-l-blue-400/80", icon: "text-blue-400", surface: "bg-blue-500/10" },
  ]
  const accent = accents[Array.from(task.columnId).reduce((sum, character) => sum + character.charCodeAt(0), 0) % accents.length]
  const createdDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <motion.div
      whileHover={reduceMotion || isDragging ? undefined : { y: -2, scale: 1.01 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <Card className={cn(
        "group relative overflow-hidden rounded-xl border-border/70 border-l-2 bg-card/90 shadow-sm backdrop-blur transition-all hover:border-primary/35 hover:shadow-lg hover:shadow-primary/10",
        accent.border,
        isDragging && "rotate-1 border-primary/50 opacity-80 shadow-xl shadow-primary/20"
      )}>
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-br to-transparent opacity-80", accent.glow)} />
      <CardHeader className="relative flex flex-row items-start justify-between space-y-0 p-4 pb-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", accent.surface, accent.icon)}>
            <Circle className="size-3.5" strokeWidth={2.5} />
          </span>
          <CardTitle className="min-w-0 text-sm font-semibold leading-snug tracking-tight text-foreground">
            {task.title}
          </CardTitle>
        </div>

        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-1 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
              <MoreVertical className="size-3.5" />
              <span className="sr-only">Task actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(task)}
                  className="gap-2 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(task)}
                  className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      {task.description && (
        <CardContent className="relative px-4 pb-2 pt-0 text-xs leading-5 text-muted-foreground line-clamp-3 whitespace-pre-wrap">
          {task.description}
        </CardContent>
      )}
      <CardContent className="relative flex items-center gap-2 px-4 pb-4 pt-2 text-[11px] text-muted-foreground">
        <CalendarDays className={cn("size-3.5", accent.icon)} />
        <span>Created {createdDate}</span>
      </CardContent>
    </Card>
    </motion.div>
  )
}
