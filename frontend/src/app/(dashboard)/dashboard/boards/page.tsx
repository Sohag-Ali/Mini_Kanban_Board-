import { BoardsOverview } from "@/components/boards/boards-overview"

export default function MyBoardsPage() {
  return (
    <div className="container mx-auto space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My Boards</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All boards currently available to your account.
        </p>
      </div>
      <BoardsOverview filter="owned" />
    </div>
  )
}
