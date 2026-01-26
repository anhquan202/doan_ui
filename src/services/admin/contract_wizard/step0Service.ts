import { networkManager } from "@/api/axiosConfig"

export interface Step0Supply {
  supply_id: number
  quantity?: number
}

export interface Step0Utility {
  utility_id: number
}

export interface Step0Data {
  room_id: number
  supplies?: Step0Supply[]
  utilities?: Step0Utility[]
}

export interface Step0Response {
  success: true
  message: string
  data: {
    draft_id: number
    current_step: number
    room_id: number
    supplies_count: number
    utilities_count: number
    expires_at: string
  }
}

export const step0Service = async (data: Step0Data) => {
  try {
    const res = await networkManager.post<Step0Response>(
      '/v1/contract_wizard/init_room',
      data
    )
    return res
  } catch (error) {
    throw error
  }
}

export default step0Service
