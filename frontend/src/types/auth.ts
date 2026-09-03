export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED'

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  needPasswordChange: boolean
  status: UserStatus
  isDeleted: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterResponseData {
  accessToken: string
  refreshToken: string
  user: User
}

export interface LoginResponseData {
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenResponseData {
  accessToken: string
  refreshToken: string
}
