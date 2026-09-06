"use client"

import { LogOut, Settings, UserRound } from "lucide-react"
import Link from "next/link"

import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  const { user, logout } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="gap-2 px-2 sm:px-3" />}
        aria-label="Open user menu"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserRound className="size-4" />
        </span>
        <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
          {user?.name || "Account"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="max-w-full truncate">
          <span className="block truncate">{user?.name || "Account"}</span>
          {user?.email && (
            <span className="mt-1 block truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" />} className="gap-2">
          <UserRound className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings" />} className="gap-2">
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
