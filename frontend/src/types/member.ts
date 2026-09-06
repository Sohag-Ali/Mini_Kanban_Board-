export type BoardRole = 'OWNER' | 'EDITOR' | 'VIEWER'

export interface BoardMemberUser {
  id: string
  name: string
  email: string
}

export interface BoardMember {
  id: string
  boardId: string
  userId: string
  role: BoardRole
  createdAt: string
  user: BoardMemberUser
}

export interface AddBoardMemberPayload {
  userId?: string
  email?: string
  role?: 'EDITOR' | 'VIEWER'
}

export interface UpdateBoardMemberRolePayload {
  role: 'EDITOR' | 'VIEWER'
}
