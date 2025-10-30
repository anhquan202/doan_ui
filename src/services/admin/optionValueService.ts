import { networkManager } from "@/api/axiosConfig"

export interface OptionItem {
  key: string
  value: string
}

// Đây là function chính export ra
const optionValueService = () => {
  /**
   * Lấy options cho Supply unit
   */
  const getSupplyUnitOptions = async (): Promise<OptionItem[]> => {
    try {
      const res = await networkManager.get('/v1/option_values/supplies/unit')
      return res.data
    } catch (error) {
      console.error('Failed to fetch supply unit options:', error)
      return []
    }
  }

  return {
    getSupplyUnitOptions,
  }
}

export default optionValueService
