import { networkManager } from "@/api/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiPath";

export interface EditRoomResponse {
  success: boolean;
  message: string;
}

export type EditRoomPayload = {
  room_type: string;
  price: number;
  description: string;
  room_supplies_attributes: { supply_id: number; quantity: number }[];
  room_utilities_attributes: { utility_id: number; is_required: boolean }[];
};

const editService = async (id: number, payload: EditRoomPayload): Promise<EditRoomResponse> => {
  try {
    const url = API_ENDPOINTS.ROOM.EDIT(id);
    const response = await networkManager.patch(url, payload);
    return response as unknown as EditRoomResponse;
  } catch (error) {
    throw error;
  }
};

export default editService;
