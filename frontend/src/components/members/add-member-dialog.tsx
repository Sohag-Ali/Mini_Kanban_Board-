"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Check, ChevronDown, Loader2, Search, UserPlus, X } from "lucide-react"

import { memberService } from "@/services/member.service"
import { userService } from "@/services/user.service"
import { UserSearchResult } from "@/types/user"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AssignableRole, MemberRoleSelect } from "@/components/members/member-role-select"

const addMemberSchema = z.object({
  userId: z.string().min(1, "Please select a user."),
  role: z.enum(["EDITOR", "VIEWER"] as const),
})

type AddMemberFormValues = z.infer<typeof addMemberSchema>

interface AddMemberDialogProps {
  boardId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddMemberDialog({
  boardId,
  open,
  onOpenChange,
  onSuccess,
}: AddMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [users, setUsers] = React.useState<UserSearchResult[]>([])
  const [selectedUser, setSelectedUser] = React.useState<UserSearchResult | null>(null)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [isSearching, setIsSearching] = React.useState(false)
  const [searchError, setSearchError] = React.useState<string | null>(null)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const searchRequestId = React.useRef(0)

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      userId: "",
      role: "EDITOR",
    },
  })

  function resetSelector() {
    form.reset()
    setSearch("")
    setUsers([])
    setSelectedUser(null)
    setIsSearchOpen(false)
    setSearchError(null)
    setActiveIndex(-1)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetSelector()
    onOpenChange(nextOpen)
  }

  React.useEffect(() => {
    if (!open || !boardId || selectedUser) return

    const requestId = ++searchRequestId.current
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true)
      setSearchError(null)

      try {
        const response = await userService.searchUsers(boardId, search, 5)
        if (requestId !== searchRequestId.current) return
        setUsers(response.success && response.data ? response.data : [])
        if (!response.success) {
          setSearchError(response.message || "Unable to search users.")
        }
      } catch (error) {
        if (requestId !== searchRequestId.current) return
        setUsers([])
        setSearchError(error instanceof Error ? error.message : "Unable to search users.")
      } finally {
        if (requestId === searchRequestId.current) {
          setIsSearching(false)
        }
      }
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [boardId, open, search, selectedUser])

  function selectUser(user: UserSearchResult) {
    setSelectedUser(user)
    form.setValue("userId", user.id, { shouldValidate: true })
    setSearch(user.name)
    setIsSearchOpen(false)
    setActiveIndex(-1)
  }

  function clearSelectedUser() {
    setSelectedUser(null)
    form.setValue("userId", "", { shouldValidate: true })
    setSearch("")
    setIsSearchOpen(true)
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      setIsSearchOpen(false)
      return
    }

    if (!isSearchOpen || users.length === 0) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % users.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) => (current <= 0 ? users.length - 1 : current - 1))
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault()
      selectUser(users[activeIndex])
    }
  }

  async function handleSubmit(values: AddMemberFormValues) {
    if (!boardId) return
    setIsSubmitting(true)

    try {
      const response = await memberService.addMember(boardId, {
        userId: values.userId,
        role: values.role as AssignableRole,
      })

      if (response.success) {
        toast.success(response.message || "Member added successfully")
        handleOpenChange(false)
        onSuccess()
      } else {
        toast.error(response.message || "Failed to add member")
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to add member"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" />
            Share Board
          </DialogTitle>
          <DialogDescription>
            Invite an existing registered user to collaborate on this board.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="userId"
              render={() => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <div className="relative">
                    <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                      <Search className="size-4 shrink-0 text-muted-foreground" />
                      <Input
                        value={search}
                        onChange={(event) => {
                          setSearch(event.target.value)
                          setIsSearchOpen(true)
                          setActiveIndex(-1)
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search by name or email..."
                        disabled={isSubmitting}
                        autoFocus
                        autoComplete="off"
                        role="combobox"
                        aria-expanded={isSearchOpen}
                        aria-controls="share-board-user-results"
                        aria-autocomplete="list"
                        className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                      />
                      {selectedUser ? (
                        <button
                          type="button"
                          onClick={clearSelectedUser}
                          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Clear selected user"
                        >
                          <X className="size-4" />
                        </button>
                      ) : (
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      )}
                    </div>

                    {isSearchOpen && !selectedUser && (
                      <div
                        id="share-board-user-results"
                        role="listbox"
                        className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border/70 bg-popover/95 p-1 text-popover-foreground shadow-xl backdrop-blur-xl"
                      >
                        {isSearching ? (
                          <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            Searching users...
                          </div>
                        ) : searchError ? (
                          <p className="px-3 py-4 text-sm text-destructive">Unable to search users.</p>
                        ) : users.length === 0 ? (
                          <div className="px-3 py-4 text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">No users found</p>
                            <p className="mt-1 text-xs">Try another name or email.</p>
                          </div>
                        ) : (
                          users.map((user, index) => (
                            <button
                              key={user.id}
                              type="button"
                              role="option"
                              aria-selected={activeIndex === index}
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => selectUser(user)}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent hover:text-accent-foreground ${activeIndex === index ? "bg-accent text-accent-foreground" : ""}`}
                            >
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium">{user.name}</span>
                                <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
                              </span>
                              <Check className="size-4 text-primary" />
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {selectedUser && (
                    <div className="mt-2 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{selectedUser.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">{selectedUser.email}</span>
                      </span>
                      <Check className="size-4 text-primary" />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Permission Role</FormLabel>
                  <FormControl>
                    <MemberRoleSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Member"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
