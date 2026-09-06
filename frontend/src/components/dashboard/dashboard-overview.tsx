"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, CheckCircle2, Circle, ClipboardList, FolderKanban, MoreVertical, Pencil, Trash2, UsersRound } from "lucide-react"

import { Board } from "@/types/board"
import { DashboardOverviewData } from "@/hooks/use-dashboard-overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fadeUp, staggerChildren } from "@/lib/animations"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DashboardOverviewProps {
  userName?: string
  currentUserId?: string
  boards: Board[]
  overview: DashboardOverviewData
  isLoading: boolean
  onCreateBoard: () => void
  onEditBoard: (board: Board) => void
  onDeleteBoard: (board: Board) => void
}

const statStyles = [
  { label: "Boards", icon: FolderKanban, value: "boards", tone: "text-primary bg-primary/10" },
  { label: "Shared", icon: UsersRound, value: "shared", tone: "text-cyan-500 bg-cyan-500/10" },
  { label: "Tasks", icon: ClipboardList, value: "tasks", tone: "text-violet-500 bg-violet-500/10" },
  { label: "Completed", icon: CheckCircle2, value: "completed", tone: "text-emerald-500 bg-emerald-500/10" },
] as const

export function DashboardOverview({ userName, currentUserId, boards, overview, isLoading, onCreateBoard, onEditBoard, onDeleteBoard }: DashboardOverviewProps) {
  const reduceMotion = useReducedMotion()
  const values = {
    boards: boards.length,
    shared: boards.filter((board) => board.ownerId !== currentUserId).length,
    tasks: overview.totalTasks,
    completed: overview.completedTasks,
  }
  const totalFlow = overview.todoTasks + overview.progressTasks + overview.doneTasks || 1
  const flow = [
    { label: "To Do", count: overview.todoTasks, color: "bg-primary" },
    { label: "Progress", count: overview.progressTasks, color: "bg-cyan-500" },
    { label: "Done", count: overview.doneTasks, color: "bg-emerald-500" },
  ]

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_12%_0%,_color-mix(in_oklch,var(--primary)_16%,transparent),_transparent_34%),radial-gradient(circle_at_88%_8%,_color-mix(in_oklch,var(--chart-2)_12%,transparent),_transparent_30%)]" />
      <div className="container relative mx-auto space-y-6 px-4 py-7 sm:px-6 lg:py-9">
        <motion.div initial="hidden" animate="visible" variants={reduceMotion ? undefined : fadeUp} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Welcome back, {userName?.split(" ")[0] || "there"} <span aria-hidden>👋</span></p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Here&apos;s what&apos;s happening with your workspace</h1>
          </div>
          <Button onClick={onCreateBoard} className="gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 shadow-lg shadow-primary/20">
            <span className="text-lg leading-none">+</span> Create board
          </Button>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={reduceMotion ? undefined : staggerChildren} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statStyles.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} variants={reduceMotion ? undefined : fadeUp} className="rounded-2xl border border-border/70 bg-card/75 p-4 shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between"><span className={cn("flex size-9 items-center justify-center rounded-xl", stat.tone)}><Icon className="size-4" /></span><span className="text-xs text-muted-foreground">Live</span></div>
                <p className="mt-4 text-2xl font-semibold">{isLoading ? "..." : values[stat.value]}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Card className="rounded-2xl border-border/70 bg-card/70 shadow-sm backdrop-blur">
            <CardHeader><CardTitle className="text-base">Task Overview</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {flow.map((item) => (
                <div key={item.label} className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{item.label}</span><span className="font-semibold">{isLoading ? "-" : item.count}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full transition-all", item.color)} style={{ width: `${(item.count / totalFlow) * 100}%` }} /></div></div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 bg-card/70 shadow-sm backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">Recent Boards</CardTitle><Link href="/dashboard/boards" className="text-xs font-medium text-primary hover:underline">View all</Link></CardHeader>
            <CardContent className="space-y-2">
              {boards.slice(0, 4).map((board) => <div key={board.id} className="flex items-center gap-2 rounded-xl border border-transparent bg-muted/40 px-3 py-2 text-sm transition-colors hover:border-primary/20 hover:bg-primary/5"><Link href={`/boards/${board.id}`} className="flex min-w-0 flex-1 items-center gap-2 py-1"><span className="text-base">✨</span><span className="truncate font-medium">{board.name}</span></Link><ArrowRight className="size-4 shrink-0 text-muted-foreground" />{board.ownerId === currentUserId && <DropdownMenu><DropdownMenuTrigger className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={`Actions for ${board.name}`}><MoreVertical className="size-4" /></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-36"><DropdownMenuItem onClick={() => onEditBoard(board)} className="gap-2"><Pencil className="size-3.5" />Edit</DropdownMenuItem><DropdownMenuItem onClick={() => onDeleteBoard(board)} className="gap-2 text-destructive focus:text-destructive"><Trash2 className="size-3.5" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>}</div>)}
              {boards.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No boards yet.</p>}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border/70 bg-card/70 shadow-sm backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">Recent Tasks</CardTitle><Badge variant="secondary">{overview.tasks.length} total</Badge></CardHeader>
          <CardContent>
            {overview.tasks.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Tasks from your boards will appear here.</p> : <div className="divide-y divide-border/60">{overview.tasks.slice(0, 8).map((task) => { const isDone = task.columnName.toLowerCase().includes("done") || task.columnName.toLowerCase().includes("complete"); return <Link key={`${task.boardId}-${task.id}`} href={`/boards/${task.boardId}`} className="flex items-center gap-3 py-3 transition-colors hover:bg-muted/30"><span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", isDone ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground")}>{isDone ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}</span><span className="min-w-0 flex-1 truncate text-sm font-medium">{task.title}</span><Badge variant="outline" className="hidden shrink-0 sm:inline-flex">{task.columnName}</Badge><span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{new Date(task.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></Link> })}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
