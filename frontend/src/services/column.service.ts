import apiClient from '@/lib/axios'
import { ApiResponse } from '@/types/api'
import { Column, CreateColumnPayload, UpdateColumnPayload } from '@/types/column'

export const columnService = {
  async createColumn(boardId: string, payload: CreateColumnPayload): Promise<ApiResponse<Column>> {
    const response = await apiClient.post<ApiResponse<Column>>(`/boards/${boardId}/columns`, payload)
    return response.data
  },

  async getColumns(boardId: string): Promise<ApiResponse<Column[]>> {
    const response = await apiClient.get<ApiResponse<Column[]>>(`/boards/${boardId}/columns`)
    return response.data
  },

  async getColumnById(boardId: string, columnId: string): Promise<ApiResponse<Column>> {
    const response = await apiClient.get<ApiResponse<Column>>(`/boards/${boardId}/columns/${columnId}`)
    return response.data
  },

  async updateColumn(boardId: string, columnId: string, payload: UpdateColumnPayload): Promise<ApiResponse<Column>> {
    const response = await apiClient.patch<ApiResponse<Column>>(`/boards/${boardId}/columns/${columnId}`, payload)
    return response.data
  },

  async deleteColumn(boardId: string, columnId: string): Promise<ApiResponse<Column>> {
    const response = await apiClient.delete<ApiResponse<Column>>(`/boards/${boardId}/columns/${columnId}`)
    return response.data
  },
}

export default columnService
