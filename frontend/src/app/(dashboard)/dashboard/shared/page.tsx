import { UsersRound } from "lucide-react"
import { SharedBoardsOverview } from "@/components/boards/shared-boards-overview"

export default function SharedBoardsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UsersRound className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Shared Boards</h1>
          <p className="text-sm text-muted-foreground">Boards other people have shared with you.</p>
        </div>
      </div>
      <SharedBoardsOverview />
    </div>
  )
}
