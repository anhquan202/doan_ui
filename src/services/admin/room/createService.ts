import { networkManager } from "@/api/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiPath";

type RawRoomSupply = {
  supply_id?: number | string;
  quantity?: number | string;
  [k: string]: any;
};

type RawRoomUtility = {
  utility_id?: number | string;
  is_required?: boolean | string | number;
  [k: string]: any;
};

type RawRoomInput = {
  room_type?: string;
  status?: string;
  price?: number | string;
  description?: string;
  room_supplies_attributes?: RawRoomSupply[];
  room_utilities_attributes?: RawRoomUtility[];
  [k: string]: any;
};

export type RoomSupplyAttribute = {
  supply_id: number;
  quantity: number;
};

export type RoomUtilityAttribute = {
  utility_id: number;
  is_required: boolean;
};

export type CreateRoomPayload = {
  room_type: string;
  status: string;
  price: number;
  description: string;
  room_supplies_attributes: RoomSupplyAttribute[];
  room_utilities_attributes: RoomUtilityAttribute[];
};

const createService = async (payload: CreateRoomPayload) => {
  try {
    const response = await networkManager.post(API_ENDPOINTS.ROOM.CREATE, payload)
    return response.data
  } catch (error) {
    throw error
  }
}
export default createService