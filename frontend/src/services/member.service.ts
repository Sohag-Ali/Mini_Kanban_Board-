import apiClient from '@/lib/axios'
import { ApiResponse } from '@/types/api'
import { AddBoardMemberPayload, BoardMember, UpdateBoardMemberRolePayload } from '@/types/member'

export const memberService = {
  async addMember(boardId: string, payload: AddBoardMemberPayload): Promise<ApiResponse<BoardMember>> {
    const response = await apiClient.post<ApiResponse<BoardMember>>(`/boards/${boardId}/members`, payload)
    return response.data
  },

  async getMembers(boardId: string): Promise<ApiResponse<BoardMember[]>> {
    const response = await apiClient.get<ApiResponse<BoardMember[]>>(`/boards/${boardId}/members`)
    return response.data
  },

  async updateMemberRole(
    boardId: string,
    userId: string,
    payload: UpdateBoardMemberRolePayload
  ): Promise<ApiResponse<BoardMember>> {
    const response = await apiClient.patch<ApiResponse<BoardMember>>(`/boards/${boardId}/members/${userId}`, payload)
    return response.data
  },

  async removeMember(boardId: string, userId: string): Promise<ApiResponse<BoardMember>> {
    const response = await apiClient.delete<ApiResponse<BoardMember>>(`/boards/${boardId}/members/${userId}`)
    return response.data
  },
}

export default memberService
