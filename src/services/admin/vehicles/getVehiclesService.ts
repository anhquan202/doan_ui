import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"
import type { ApiResponse } from "@/types/Customers"
import type { VehicleResponse } from "@/types/Vehicles"

export const getVehiclesService = async () => {
  try {
    const res = await networkManager.get<ApiResponse<VehicleResponse>>(API_ENDPOINTS.VEHICLES.LIST)
    return res
  } catch (error) {
    throw error
  }
}