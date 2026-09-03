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
