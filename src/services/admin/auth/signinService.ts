import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"
type signinData = {
  email: string
  password: string
}
const signinService = async (signinData: signinData) => {
  try {
    const response = await networkManager.post(API_ENDPOINTS.AUTH.SIGN_IN, signinData)
    return response.data
  } catch (error) {
    throw error
  }
}
export default signinService