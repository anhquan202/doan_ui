import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"

type ResponseApi = {
  success: boolean
  message: string
}
type Params = {
  fee: string
}
const editUtilitiesService = async (id: number, params: Params) => {
  try {
    const url = API_ENDPOINTS.UTILITIES.EDIT(id)
    const response = await networkManager.patch(url, params)
    return response as unknown as ResponseApi
  } catch (error) {
    throw error
  }
}
export default editUtilitiesService