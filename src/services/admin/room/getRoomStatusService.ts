import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"

const getRoomStatusService = async () => {
  try {
    const response = await networkManager.get(API_ENDPOINTS.ROOM.STATUS)
    return response.data
  } catch (error) {
    throw error
  }
}
export default getRoomStatusService