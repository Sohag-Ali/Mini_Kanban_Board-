"use client"

import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight, Plus, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { fadeUp } from "@/lib/animations"

interface BoardPageHeaderProps {
  userName?: string
  onCreate: () => void
}

export function BoardPageHeader({ userName, onCreate }: BoardPageHeaderProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      initial="hidden"
      animate="visible"
      variants={reduceMotion ? undefined : fadeUp}
    >
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Your <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">Boards</span>
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
          Manage your personal and collaborative Kanban boards from one focused workspace.
        </p>
      </div>
      <Button
        onClick={onCreate}
        size="lg"
        className="group h-11 gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 hover:shadow-primary/30"
      >
        <Plus className="size-4" />
        Create board
        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Button>
    </motion.div>
  )
}
