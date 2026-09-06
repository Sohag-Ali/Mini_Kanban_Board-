import type { BoardRole } from "@/types/member"

export interface Board {
  id: string
  name: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface CreateBoardPayload {
  name: string
}

export interface UpdateBoardPayload {
  name: string
}

export interface SharedBoard extends Board {
  role: Exclude<BoardRole, "OWNER">
  owner: {
    id: string
    name: string
    email: string
  }
}
