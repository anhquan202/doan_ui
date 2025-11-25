import { networkManager } from "@/api/axiosConfig";
import type { OptionItem } from "../optionValueService";

export const getStatusContractService = async (): Promise<OptionItem[]> => {
  try {
    const res = await networkManager.get('/v1/option_values/contracts/status')
    return res.data
  } catch (error) {
    throw error
  }
}