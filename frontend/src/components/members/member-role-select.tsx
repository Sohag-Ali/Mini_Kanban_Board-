"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type AssignableRole = "EDITOR" | "VIEWER"

interface MemberRoleSelectProps {
  value: AssignableRole
  onValueChange: (role: AssignableRole) => void
  disabled?: boolean
}

export function MemberRoleSelect({
  value,
  onValueChange,
  disabled = false,
}: MemberRoleSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val as AssignableRole)}
      disabled={disabled}
    >
      <SelectTrigger className="h-8 w-28 text-xs font-medium">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="EDITOR" className="text-xs">
          <div className="flex flex-col">
            <span className="font-medium">Editor</span>
            <span className="text-[10px] text-muted-foreground">Can edit board & tasks</span>
          </div>
        </SelectItem>
        <SelectItem value="VIEWER" className="text-xs">
          <div className="flex flex-col">
            <span className="font-medium">Viewer</span>
            <span className="text-[10px] text-muted-foreground">Read-only access</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
