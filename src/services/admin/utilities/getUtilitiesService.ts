import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"

const getUtilitiesService = async () => {
  try {
    const response = await networkManager.get(API_ENDPOINTS.UTILITIES.LIST)
    return response.data.utilities
  } catch (error) {
    throw error
  }
}
export default getUtilitiesService