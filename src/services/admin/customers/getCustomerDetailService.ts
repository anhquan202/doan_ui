import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"
import type { ApiResponse, CustomerDetailResponseData } from "@/types/Customers"

export const getCustomerDetailService = async (id: number) => {
  try {
    const apiEndpoint = API_ENDPOINTS.CUSTOMERS.DETAIL(id)
    const res = await networkManager.get<ApiResponse<CustomerDetailResponseData>>(apiEndpoint)
    return res
  } catch (err) {
    throw err
  }
}
