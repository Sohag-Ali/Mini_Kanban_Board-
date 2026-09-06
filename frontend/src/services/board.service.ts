import apiClient from '@/lib/axios'
import { ApiResponse } from '@/types/api'
import { Board, CreateBoardPayload, SharedBoard, UpdateBoardPayload } from '@/types/board'

export const boardService = {
  async createBoard(payload: CreateBoardPayload): Promise<ApiResponse<Board>> {
    const response = await apiClient.post<ApiResponse<Board>>('/boards', payload)
    return response.data
  },

  async getAllBoards(): Promise<ApiResponse<Board[]>> {
    const response = await apiClient.get<ApiResponse<Board[]>>('/boards')
    return response.data
  },

  async getSharedBoards(): Promise<ApiResponse<SharedBoard[]>> {
    const response = await apiClient.get<ApiResponse<SharedBoard[]>>('/boards/shared')
    return response.data
  },

  async getBoardById(id: string): Promise<ApiResponse<Board>> {
    const response = await apiClient.get<ApiResponse<Board>>(`/boards/${id}`)
    return response.data
  },

  async updateBoard(id: string, payload: UpdateBoardPayload): Promise<ApiResponse<Board>> {
    const response = await apiClient.patch<ApiResponse<Board>>(`/boards/${id}`, payload)
    return response.data
  },

  async deleteBoard(id: string): Promise<ApiResponse<Board>> {
    const response = await apiClient.delete<ApiResponse<Board>>(`/boards/${id}`)
    return response.data
  },
}

export default boardService
