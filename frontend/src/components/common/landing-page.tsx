"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, CheckCircle2, Kanban, Sparkles } from "lucide-react"

import { ThemeToggle } from "@/components/common/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { fadeIn, fadeUp, scaleIn, staggerChildren } from "@/lib/animations"
import { cn } from "@/lib/utils"

const previewColumns = [
  { name: "Backlog", cards: ["Map the next milestone", "Write a quick brief"] },
  { name: "In progress", cards: ["Shape the first release", "Review open questions"] },
  { name: "Done", cards: ["Align the team", "Plan the weekly sync"] },
]

export function LandingPage() {
  const shouldReduceMotion = useReducedMotion()
  const revealVariants = shouldReduceMotion ? fadeIn : fadeUp

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[34rem] bg-[radial-gradient(circle_at_top_right,_color-mix(in_oklch,var(--primary)_12%,transparent),_transparent_45%),radial-gradient(circle_at_top_left,_color-mix(in_oklch,var(--chart-2)_12%,transparent),_transparent_40%)]" />
      <motion.nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10" initial="hidden" animate="visible" variants={fadeIn}>
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"><Kanban className="size-5" /></span>
          <span className="text-lg">Mini Kanban</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>Log in</Link>
        </div>
      </motion.nav>

      <motion.section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-28 lg:pt-20" initial="hidden" animate="visible" variants={staggerChildren}>
        <div className="max-w-xl">
          <motion.div variants={revealVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary"><Sparkles className="size-3.5" />Focused work, visible progress</motion.div>
          <motion.h1 variants={revealVariants} className="max-w-lg text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">Make the work move forward.</motion.h1>
          <motion.p variants={revealVariants} className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">A calm, collaborative Kanban space for turning scattered ideas into clear next steps and finished work.</motion.p>
          <motion.div variants={revealVariants} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-5")}>Get started<ArrowRight className="size-4" /></Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}>Log in</Link>
          </motion.div>
          <motion.div variants={revealVariants} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-success" />Simple by design</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-success" />Built for teams</span>
          </motion.div>
        </div>

        <motion.div variants={shouldReduceMotion ? fadeIn : scaleIn} className="relative lg:pl-6">
          <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
          <div className="relative rounded-xl border bg-card p-4 shadow-md sm:p-6">
            <div className="flex items-center justify-between border-b pb-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Workspace preview</p><h2 className="mt-1 text-lg font-semibold">Product launch</h2></div><span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">6 items</span></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {previewColumns.map((column) => <div key={column.name} className="min-w-0 rounded-lg bg-muted p-3"><div className="mb-3 flex items-center justify-between gap-2"><h3 className="truncate text-xs font-semibold text-muted-foreground">{column.name}</h3><span className="text-[10px] text-muted-foreground">{column.cards.length}</span></div><div className="space-y-2">{column.cards.map((card) => <div key={card} className="rounded-md border bg-card p-3 text-xs font-medium text-card-foreground shadow-sm transition-transform hover:-translate-y-0.5">{card}</div>)}</div></div>)}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground"><span>Drag ideas into motion</span><span className="size-2 rounded-full bg-warning" /></div>
          </div>
        </motion.div>
      </motion.section>

      <section className="relative z-10 border-t bg-muted/30"><div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 text-sm text-muted-foreground sm:grid-cols-3 lg:px-10"><div><p className="font-semibold text-foreground">See the whole picture</p><p className="mt-1 leading-6">Keep priorities, ownership, and progress in one place.</p></div><div><p className="font-semibold text-foreground">Move with confidence</p><p className="mt-1 leading-6">Make the next action obvious for everyone on the team.</p></div><div><p className="font-semibold text-foreground">Start in seconds</p><p className="mt-1 leading-6">Create your workspace and get your work organized.</p></div></div></section>
    </main>
  )
}
