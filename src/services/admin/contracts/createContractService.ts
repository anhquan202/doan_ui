import { networkManager } from "@/api/axiosConfig"
import { API_ENDPOINTS } from "@/constants/apiPath"

type CreateContractParams = {
  start_date: string
  term_months: number
  deposit: number
  room_id: number
  customers: Array<{
    identity_code: string
    first_name: string
    last_name: string
    email: string
    phone: string
    address: string
    gender: number
    date_of_birth: string
    is_represent: boolean
  }>
  utilities: Array<{
    utility_id: number
  }>
}

export const createContractService = async (params: CreateContractParams) => {
  try {
    const response = await networkManager.post(API_ENDPOINTS.CONTRACTS.CREATE, params)
    return response
  } catch (error) {
    throw error
  }
}
