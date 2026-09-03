export interface Column {
  id: string
  name: string
  boardId: string
  position: number
  createdAt: string
  updatedAt: string
}

export interface CreateColumnPayload {
  name: string
}

export interface UpdateColumnPayload {
  name?: string
}
