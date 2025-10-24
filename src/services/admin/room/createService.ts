import { networkManager } from "@/api/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiPath";

export interface CreateRoomResponse {
  success: boolean;
  message: string;
  data: any;
}

export type CreateRoomPayload = {
  room_type: string;
  price: number;
  description: string;
  room_supplies_attributes: { supply_id: number; quantity: number }[];
  room_utilities_attributes: { utility_id: number; is_required: boolean }[];
};

const createService = async (payload: CreateRoomPayload): Promise<CreateRoomResponse> => {
  try {
    // ép kiểu response về CreateRoomResponse
    const response = await networkManager.post(API_ENDPOINTS.ROOM.CREATE, payload) as CreateRoomResponse;
    return response;
  } catch (error) {
    throw error;
  }
};

export default createService;
