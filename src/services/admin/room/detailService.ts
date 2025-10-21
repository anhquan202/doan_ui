import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"

const detailService = async (room_id: number) => {
  try {
    const url = API_ENDPOINTS.ROOM.SHOW(room_id)
    const response = await networkManager.get(url)
    return response.data
  } catch (error) {
    throw error
  }
}
export default detailService