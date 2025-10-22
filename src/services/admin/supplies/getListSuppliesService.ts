import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"

const getListSuppliesService = async () => {
  try {
    const response = await networkManager.get(API_ENDPOINTS.SUPPLIES.LIST)
    return response.data
  } catch (error) {
    throw error
  }
}
export default getListSuppliesService