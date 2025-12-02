import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"

export const toggleActiveVehicleService = async (id: number) => {
  try {
    const apiEndpoint = API_ENDPOINTS.VEHICLES.TOGGLE_ACTIVE(id)
    const res = await networkManager.post(apiEndpoint)
    return res
  } catch (error) {
    throw error
  }
}