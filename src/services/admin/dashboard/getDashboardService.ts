import { networkManager } from '@/api/axiosConfig'
import { API_ENDPOINTS } from '@/constants/apiPath'
import type { ApiResponse } from '@/types/ApiResponse'
import type { DashboardResponse } from '@/types/Dashboard'

export const getDashboardService = async (params?: Record<string, any>) => {
  try {
    const response = await networkManager.get<ApiResponse<DashboardResponse>>(API_ENDPOINTS.DASHBOARD.SUMMARY, params)
    return response
  } catch (error) {
    throw error
  }
}
