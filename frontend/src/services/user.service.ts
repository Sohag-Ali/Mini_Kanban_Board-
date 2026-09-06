import apiClient from '@/lib/axios'
import { ApiResponse } from '@/types/api'
import { UserSearchResult } from '@/types/user'

export const userService = {
  async searchUsers(
    boardId: string,
    search = '',
    limit = 5,
  ): Promise<ApiResponse<UserSearchResult[]>> {
    const response = await apiClient.get<ApiResponse<UserSearchResult[]>>('/users/search', {
      params: { boardId, search, limit },
    })
    return response.data
  },
}

export default userService
