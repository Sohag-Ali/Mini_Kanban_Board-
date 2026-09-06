"use client"

import { CalendarDays, Mail, LogOut, ShieldCheck, UserRound } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "-"

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Account</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View your account information and workspace identity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="flex size-24 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground shadow-sm">
              {initials || <UserRound className="size-9" />}
            </div>
            <h2 className="mt-5 text-xl font-semibold">{user?.name || "Account"}</h2>
            <p className="mt-1 break-all text-sm text-muted-foreground">{user?.email || "-"}</p>
            <Badge variant="secondary" className="mt-4 gap-1.5">
              <ShieldCheck className="size-3.5" />
              {user?.status || "ACTIVE"}
            </Badge>
            <Button
              variant="outline"
              className="mt-6 w-full gap-2"
              onClick={logout}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account information</CardTitle>
            <CardDescription>
              Details from your current authenticated account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</p>
                <p className="mt-1 font-medium">{user?.name || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
                <p className="mt-1 break-all font-medium">{user?.email || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Member since</p>
                <p className="mt-1 font-medium">{createdDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
