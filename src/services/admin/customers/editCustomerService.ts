
import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"
import type { EditCustomerPayload } from "@/types/Customers"
export const editCustomerService = async (params: EditCustomerPayload) => {
  try {
    const apiEndpoint = API_ENDPOINTS.CUSTOMERS.EDIT(params.id)
    const res = await networkManager.patch(apiEndpoint, params)
    return res
  } catch (error) {
    throw error
  }
}