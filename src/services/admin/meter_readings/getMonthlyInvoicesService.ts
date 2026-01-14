import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"
import type { ApiResponse } from "@/types/ApiResponse"
import type { MonthlyInvoicesResponse, MonthlyInvoicesParams } from "@/types/MonthlyInvoices"

export const getMonthlyInvoicesService = async (params: MonthlyInvoicesParams) => {
  try {
    const response = await networkManager.get<ApiResponse<MonthlyInvoicesResponse>>(
      API_ENDPOINTS.MONTHLY_INVOICES.LIST,
      params
    )
    return response
  } catch (error) {
    throw error
  }
}
