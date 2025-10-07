import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"
const signupService = {
  async signup(data: any) {
    try {
      const response = await networkManager.post(API_ENDPOINTS.AUTH.SIGN_UP, data)
      return response.data
    }
    catch (error) {
      throw error
    }
  }
}
export default signupService
