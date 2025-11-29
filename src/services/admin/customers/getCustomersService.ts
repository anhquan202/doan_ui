import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"
import type { ApiResponse, CustomersResponseData } from "@/types/Customers"

export const getCustomersService = async (page = 1, perPage = 10) => {
  try {
    const res = await networkManager.get<ApiResponse<CustomersResponseData>>(API_ENDPOINTS.CUSTOMERS.LIST, {
      page: page, per_page: perPage
    })
    return res
  } catch (err) {
    throw err
  }
}
