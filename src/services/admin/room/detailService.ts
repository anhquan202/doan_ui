// services/admin/room/detailService.ts
import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"

// Wrapper response API
interface ResponseApi<T = any> {
  success: boolean
  message: string
  data: T
}

// Chi tiết phòng
interface RoomDetail {
  id: number
  room_type: string
  room_name: string
  status: string
  price: number
  max_customers: number
  description: string
  room_supplies: {
    supply_id: number
    name: string
    unit: string
    quantity: number
  }[]
  room_utilities: {
    utility_id: number
    is_required: boolean
    utility_type: string
    utility_type_label: string
    fee: number
  }[]
}

// Trả về toàn bộ response API
const detailService = async (room_id: number): Promise<ResponseApi<{ room: RoomDetail }>> => {
  try {
    const url = API_ENDPOINTS.ROOM.SHOW(room_id)
    const response = await networkManager.get(url)
    return response as unknown as ResponseApi<{ room: RoomDetail }>
  } catch (error) {
    throw error
  }
}

export default detailService
