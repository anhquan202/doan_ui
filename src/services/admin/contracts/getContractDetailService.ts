import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"
import type { ContractDetailResponse } from "@/types/Contracts"
import type { ApiResponse } from "@/types/Customers"

export const getContractDetailService = async (id: number) => {
  try {
    const apiEndpoint = API_ENDPOINTS.CONTRACTS.SHOW(id)
    const res = await networkManager.get<ApiResponse<ContractDetailResponse>>(apiEndpoint)
    return res
  } catch (error) {
    throw error
  }
}