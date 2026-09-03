import apiClient from '@/lib/axios'
import { ApiResponse } from '@/types/api'
import {
  LoginPayload,
  LoginResponseData,
  RefreshTokenResponseData,
  RegisterPayload,
  RegisterResponseData,
  User,
} from '@/types/auth'

export const authService = {
  async register(payload: RegisterPayload): Promise<ApiResponse<RegisterResponseData>> {
    const response = await apiClient.post<ApiResponse<RegisterResponseData>>('/auth/register', payload)
    return response.data
  },

  async login(payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/login', payload)
    return response.data
  },

  async getMe(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me')
    return response.data
  },

  async refreshToken(): Promise<ApiResponse<RefreshTokenResponseData>> {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponseData>>('/auth/refresh-token')
    return response.data
  },
}

export default authService
