import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"

export type RoomStatus = {
  key: number
  label: string
  value: number
}

const getRoomStatusService = async (): Promise<RoomStatus[]> => {
  try {
    const response = await networkManager.get(API_ENDPOINTS.ROOM.STATUS)
    return response.data
  } catch (error) {
    throw error
  }
}
export default getRoomStatusService