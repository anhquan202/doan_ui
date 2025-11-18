import { networkManager } from "@/api/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiPath";

export const getContractService = async (params = {}) => {
  try {
    const response = await networkManager.get(API_ENDPOINTS.CONTRACTS.LIST)
    return response
  } catch (error) {
    throw error
  }
};