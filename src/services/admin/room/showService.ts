import { networkManager } from "@/api/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiPath";

export type Supply = {
  id: number;
  name: string;
};

export type Utility = {
  id: number;
  utility_type: string;
  description: string;
  is_required: boolean;
};

export type Room = {
  id: number;
  room_type: string;
  room_name: string;
  status: string | null;
  price: number;
  max_customers: number;
  description: string;
  supplies: Supply[];
  utilities: Utility[];
};

export type Meta = {
  current_page: number;
  from: number;
  to: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type RoomResponse = {
  rooms: Room[];
  meta: Meta;
};

const showService = async (page = 1): Promise<RoomResponse> => {
  const response = await networkManager.get(API_ENDPOINTS.ROOM.LIST, { page });

  const { data } = response;
  return {
    rooms: data.rooms,
    meta: data.meta,
  };
};

export default showService;
