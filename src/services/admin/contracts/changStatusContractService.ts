import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"

type ChangeStatusResponse = {
  success: boolean
  message: string
}

export const changeStatusContractService = async (id: number | string, status: string) => {
  try {
    const apiPath = API_ENDPOINTS.CONTRACTS.CHANGE_STATUS(id)
    const res = await networkManager.patch<ChangeStatusResponse>(apiPath, { status })
    return res
  } catch (error) {
    throw error
  }
}
