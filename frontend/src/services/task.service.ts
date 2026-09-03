import apiClient from '@/lib/axios'
import { ApiResponse } from '@/types/api'
import { CreateTaskPayload, MoveTaskPayload, Task, UpdateTaskPayload } from '@/types/task'

export const taskService = {
  async createTask(columnId: string, payload: CreateTaskPayload): Promise<ApiResponse<Task>> {
    const response = await apiClient.post<ApiResponse<Task>>(`/columns/${columnId}/tasks`, payload)
    return response.data
  },

  async getTasks(columnId: string): Promise<ApiResponse<Task[]>> {
    const response = await apiClient.get<ApiResponse<Task[]>>(`/columns/${columnId}/tasks`)
    return response.data
  },

  async getTaskById(columnId: string, taskId: string): Promise<ApiResponse<Task>> {
    const response = await apiClient.get<ApiResponse<Task>>(`/columns/${columnId}/tasks/${taskId}`)
    return response.data
  },

  async updateTask(columnId: string, taskId: string, payload: UpdateTaskPayload): Promise<ApiResponse<Task>> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/columns/${columnId}/tasks/${taskId}`, payload)
    return response.data
  },

  async deleteTask(columnId: string, taskId: string): Promise<ApiResponse<Task>> {
    const response = await apiClient.delete<ApiResponse<Task>>(`/columns/${columnId}/tasks/${taskId}`)
    return response.data
  },

  async moveTask(columnId: string, taskId: string, payload: MoveTaskPayload): Promise<ApiResponse<Task>> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/columns/${columnId}/tasks/${taskId}/move`, payload)
    return response.data
  },
}

export default taskService
