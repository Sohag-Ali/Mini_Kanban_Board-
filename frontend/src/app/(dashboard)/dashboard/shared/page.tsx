import { UsersRound } from "lucide-react"

export default function SharedBoardsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed bg-card/30 p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UsersRound className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Shared Boards</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Shared boards are not available from the current backend response. The existing GET /boards endpoint returns only boards owned by the authenticated user.
        </p>
      </div>
    </div>
  )
}
