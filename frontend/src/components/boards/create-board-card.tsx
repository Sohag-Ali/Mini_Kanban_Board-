"use client"

import { motion, useReducedMotion } from "motion/react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { fadeUp } from "@/lib/animations"

interface CreateBoardCardProps {
  onCreate: () => void
}

export function CreateBoardCard({ onCreate }: CreateBoardCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={reduceMotion ? undefined : fadeUp}
      className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-primary/[0.03] p-6 text-center transition-colors hover:border-primary/60 hover:bg-primary/[0.07]"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Plus className="size-6" />
      </div>
      <h3 className="mt-4 font-semibold">Create a new board</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">Start a new project and get organized.</p>
      <Button variant="outline" onClick={onCreate} className="mt-5 gap-2 rounded-xl border-primary/30 text-primary hover:bg-primary/10">
        <Plus className="size-4" />
        Create board
      </Button>
    </motion.div>
  )
}
