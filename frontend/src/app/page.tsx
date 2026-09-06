import Link from "next/link"
import { ArrowRight, CheckCircle2, Kanban, Sparkles } from "lucide-react"

import { PublicRoute } from "@/components/auth/public-route"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const previewColumns = [
  {
    name: "Backlog",
    tone: "bg-slate-100 dark:bg-slate-800/80",
    cards: ["Map the next milestone", "Write a quick brief"],
  },
  {
    name: "In progress",
    tone: "bg-amber-50 dark:bg-amber-950/30",
    cards: ["Shape the first release", "Review open questions"],
  },
  {
    name: "Done",
    tone: "bg-emerald-50 dark:bg-emerald-950/30",
    cards: ["Align the team", "Plan the weekly sync"],
  },
]

function LandingPageContent() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f5] text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="absolute inset-x-0 top-0 -z-0 h-[34rem] bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.22),_transparent_45%),radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_40%)]" />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-amber-300 shadow-lg shadow-slate-950/15 dark:bg-amber-300 dark:text-slate-950">
            <Kanban className="h-5 w-5" />
          </span>
          <span className="text-lg">Mini Kanban</span>
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}
        >
          Log in
        </Link>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-28 lg:pt-20">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 shadow-sm dark:border-teal-800 dark:bg-slate-900/70 dark:text-teal-300">
            <Sparkles className="h-3.5 w-3.5" />
            Focused work, visible progress
          </div>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
            Make the work move forward.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">
            A calm, collaborative Kanban space for turning scattered ideas into
            clear next steps and finished work.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 bg-slate-950 px-5 text-white hover:bg-slate-800 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200")}
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 bg-white/70 px-5 dark:bg-slate-900/70")}
            >
              Log in
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
              Simple by design
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
              Built for teams
            </span>
          </div>
        </div>

        <div className="relative lg:pl-6">
          <div className="absolute -inset-4 rounded-[2rem] bg-teal-200/30 blur-2xl dark:bg-teal-900/20" />
          <div className="relative rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Workspace preview
                </p>
                <h2 className="mt-1 text-lg font-semibold">Product launch</h2>
              </div>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                6 items
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {previewColumns.map((column) => (
                <div key={column.name} className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-950/70">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="truncate text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {column.name}
                    </h3>
                    <span className="text-[10px] text-slate-400">{column.cards.length}</span>
                  </div>
                  <div className="space-y-2">
                    {column.cards.map((card) => (
                      <div key={card} className={cn("rounded-lg border border-white p-3 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:text-slate-200", column.tone)}>
                        {card}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <span>Drag ideas into motion</span>
              <span className="h-2 w-2 rounded-full bg-amber-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-slate-200/80 bg-white/60 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3 lg:px-10">
          <div>
            <p className="font-semibold text-slate-950 dark:text-slate-50">See the whole picture</p>
            <p className="mt-1 leading-6">Keep priorities, ownership, and progress in one place.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-950 dark:text-slate-50">Move with confidence</p>
            <p className="mt-1 leading-6">Make the next action obvious for everyone on the team.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-950 dark:text-slate-50">Start in seconds</p>
            <p className="mt-1 leading-6">Create your workspace and get your work organized.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function HomePage() {
  return (
    <PublicRoute>
      <LandingPageContent />
    </PublicRoute>
  )
}
