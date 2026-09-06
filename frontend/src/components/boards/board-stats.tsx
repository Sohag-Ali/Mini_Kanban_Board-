"use client"

import { motion, useReducedMotion } from "motion/react"
import { CheckCircle2, FolderKanban, LayoutList, UsersRound } from "lucide-react"

import { fadeUp, staggerChildren } from "@/lib/animations"
import { cn } from "@/lib/utils"

interface BoardStatsProps {
  total: number
  owned: number
}

const stats = [
  { label: "Total boards", icon: FolderKanban, color: "text-primary", surface: "bg-primary/10", key: "total" },
  { label: "Owned by you", icon: CheckCircle2, color: "text-warning", surface: "bg-warning/10", key: "owned" },
  { label: "Shared access", icon: UsersRound, color: "text-cyan-500", surface: "bg-cyan-500/10", key: "shared" },
  { label: "Task insights", icon: LayoutList, color: "text-violet-500", surface: "bg-violet-500/10", key: "tasks" },
] as const

export function BoardStats({ total, owned }: BoardStatsProps) {
  const reduceMotion = useReducedMotion()
  const values = { total, owned, shared: null, tasks: null }

  return (
    <motion.div
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      initial="hidden"
      animate="visible"
      variants={reduceMotion ? undefined : staggerChildren}
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        const value = values[stat.key]
        return (
          <motion.div
            key={stat.label}
            variants={reduceMotion ? undefined : fadeUp}
            className="group rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={cn("flex size-9 items-center justify-center rounded-xl", stat.surface, stat.color)}>
                <Icon className="size-4" />
              </div>
              <span className="text-xs text-muted-foreground">{value === null ? "--" : "Live"}</span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight">{value === null ? "-" : value}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
