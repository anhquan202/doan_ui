import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"
import type { ApiResponse } from "@/types/ApiResponse"
import type { MeterReadingResponse, MeterReadingParams } from "@/types/MeterReadings"

export const getMeterReadingsService = async (params: MeterReadingParams) => {
  try {
    const response = await networkManager.get<ApiResponse<MeterReadingResponse>>(
      API_ENDPOINTS.METER_READINGS.LIST,
      params
    )
    return response
  } catch (error) {
    throw error
  }
}
