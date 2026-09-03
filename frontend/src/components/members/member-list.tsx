"use client"

import * as React from "react"
import { toast } from "sonner"
import { Crown, Trash2, UserPlus, Users } from "lucide-react"

import { memberService } from "@/services/member.service"
import { BoardMember } from "@/types/member"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/common/error-state"
import { EmptyState } from "@/components/common/empty-state"
import { ListItemSkeleton } from "@/components/common/loading-skeleton"
import { AssignableRole, MemberRoleSelect } from "@/components/members/member-role-select"

interface MemberListProps {
  boardId: string
  ownerId: string
  members: BoardMember[]
  currentUserId?: string
  isLoading: boolean
  error: string | null
  onRefresh: () => void
  onAddMemberClick: () => void
  onRemoveMemberClick: (member: BoardMember) => void
}

export function MemberList({
  boardId,
  ownerId,
  members,
  currentUserId,
  isLoading,
  error,
  onRefresh,
  onAddMemberClick,
  onRemoveMemberClick,
}: MemberListProps) {
  const isOwner = currentUserId === ownerId

  // Handler for updating a member's role
  async function handleRoleChange(userId: string, newRole: AssignableRole) {
    try {
      const response = await memberService.updateMemberRole(boardId, userId, {
        role: newRole,
      })
      if (response.success) {
        toast.success(response.message || "Member role updated")
        onRefresh()
      } else {
        toast.error(response.message || "Failed to update role")
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Failed to update role"
      toast.error(message)
    }
  }

  // Separate non-owner members
  const sharedMembers = members.filter((m) => m.userId !== ownerId)

  // Find owner object from members if available
  const ownerMember = members.find((m) => m.userId === ownerId)

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="space-y-3 py-2">
        <ListItemSkeleton />
        <ListItemSkeleton />
        <ListItemSkeleton />
      </div>
    )
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorState
        title="Failed to load members"
        description={error}
        onRetry={onRefresh}
      />
    )
  }

  return (
    <div className="space-y-6 py-2">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div>
          <h3 className="font-bold text-base tracking-tight">Board Members</h3>
          <p className="text-xs text-muted-foreground">
            People with access to this board
          </p>
        </div>
        {isOwner && (
          <Button onClick={onAddMemberClick} size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Share</span>
          </Button>
        )}
      </div>

      {/* Section 1: Board Owner */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Owner
        </span>
        <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
              {ownerMember?.user?.name
                ? ownerMember.user.name.charAt(0).toUpperCase()
                : "O"}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground">
                  {ownerMember?.user?.name || "Board Owner"}
                </span>
                {ownerMember?.userId === currentUserId && (
                  <span className="text-xs text-muted-foreground">(You)</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {ownerMember?.user?.email || "Owner Account"}
              </span>
            </div>
          </div>
          <Badge variant="default" className="gap-1 text-[10px] uppercase font-bold">
            <Crown className="h-3 w-3" />
            <span>Owner</span>
          </Badge>
        </div>
      </div>

      {/* Section 2: Shared Members */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Shared Members ({sharedMembers.length})
          </span>
        </div>

        {sharedMembers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No shared members"
            description="No additional members have been added to this board yet."
            actionLabel={isOwner ? "Invite Member" : undefined}
            onAction={isOwner ? onAddMemberClick : undefined}
            actionIcon={UserPlus}
            className="min-h-[180px] p-4"
          />
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {sharedMembers.map((member) => {
              const isSelf = member.userId === currentUserId
              const roleValue: AssignableRole =
                member.role === "VIEWER" ? "VIEWER" : "EDITOR"

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-border/40 bg-card p-3 transition-colors hover:border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-bold text-sm text-secondary-foreground">
                      {member.user?.name
                        ? member.user.name.charAt(0).toUpperCase()
                        : member.user?.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-foreground">
                          {member.user?.name || "Member"}
                        </span>
                        {isSelf && (
                          <span className="text-xs text-muted-foreground">
                            (You)
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {member.user?.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Role Selector */}
                    {isOwner ? (
                      <MemberRoleSelect
                        value={roleValue}
                        onValueChange={(newRole) =>
                          handleRoleChange(member.userId, newRole)
                        }
                      />
                    ) : (
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {member.role}
                      </Badge>
                    )}

                    {/* Remove Action Button */}
                    {(isOwner || isSelf) && (
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onRemoveMemberClick(member)}
                        title={isSelf ? "Leave board" : "Remove member"}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove member</span>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
