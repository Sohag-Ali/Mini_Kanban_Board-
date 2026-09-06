"use client"

import * as React from "react"
import { Plus, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BoardsOverview } from "@/components/boards/boards-overview"

export default function MyBoardsPage() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  return (
    <div className="container mx-auto space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      {/* SaaS Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Workspace Boards</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Boards
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Manage, organize, and navigate all your personal Kanban workspaces from one place.
          </p>
        </div>

        <div className="shrink-0">
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="lg"
            className="group h-11 gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 text-sm font-medium shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30 active:translate-y-0"
          >
            <Plus className="size-4 transition-transform duration-200 group-hover:rotate-90" />
            <span>Create Board</span>
          </Button>
        </div>
      </div>

      {/* Boards Grid with Filter */}
      <BoardsOverview
        filter="owned"
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
      />
    </div>
  )
}
