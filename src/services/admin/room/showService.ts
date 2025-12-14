import { networkManager } from "@/api/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiPath";

export type Supply = {
  id: number;
  name: string;
};

export type Utility = {
  id: number;
  utility_type: string;
  utility_type_label: string;
  description: string;
  is_required: boolean;
};

export type Room = {
  id: number;
  room_type: string;
  room_type_label: string;
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

export interface RoomQueryParams {
  q?: string;
  status?: number[];
  room_type?: number[];
  price_min?: number;
  price_max?: number;
  page?: number;
  per_page?: number;
}

const showService = async (
  page = 1,
  params?: RoomQueryParams
): Promise<RoomResponse> => {
  const queryParams = { page, ...params };

  const response = await networkManager.get(API_ENDPOINTS.ROOM.LIST, queryParams);

  return {
    rooms: response.data.rooms,
    meta: response.data.meta,
  };
};

export default showService;
