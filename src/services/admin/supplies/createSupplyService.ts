import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"

export type CreateSupplyParams = {
  name: string
  unit: string
}

export type ResponseApi = {
  message: string
  success: boolean
}

const createSupplyService = async (params: CreateSupplyParams): Promise<ResponseApi> => {
  try {
    const response = await networkManager.post(API_ENDPOINTS.SUPPLIES.CREATE, params)
    return response
  } catch (error) {
    throw error
  }
}
export default createSupplyService