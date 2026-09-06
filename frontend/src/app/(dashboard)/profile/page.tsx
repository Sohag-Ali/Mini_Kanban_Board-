"use client"

import { UserRound } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UserRound className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">Your account details.</p>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</dt><dd className="mt-1 font-medium">{user?.name || "-"}</dd></div>
          <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</dt><dd className="mt-1 font-medium">{user?.email || "-"}</dd></div>
        </dl>
      </div>
    </div>
  )
}
