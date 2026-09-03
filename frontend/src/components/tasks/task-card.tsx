"use client"

import * as React from "react"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"

import { Task } from "@/types/task"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="group relative border-border/40 bg-card/90 shadow-xs transition-all hover:border-border hover:shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-3 pb-1">
        <CardTitle className="text-sm font-semibold leading-snug tracking-tight text-foreground">
          {task.title}
        </CardTitle>

        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-foreground focus:outline-none focus:opacity-100">
              <MoreVertical className="h-3.5 w-3.5" />
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
        <CardContent className="p-3 pt-1 text-xs text-muted-foreground line-clamp-3 whitespace-pre-wrap">
          {task.description}
        </CardContent>
      )}
    </Card>
  )
}
