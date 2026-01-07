import { networkManager } from "@/api/axiosConfig"
import { mapStep3ToApi, type Step3Data, type Step3Response } from "@/types/ContractWizard"

export const step3Service = async (data: Step3Data) => {
  try {
    const payload = mapStep3ToApi(data)
    const res = await networkManager.post<Step3Response>('/v1/contract_wizard/step3', payload)
    return res
  } catch (error) {
    throw error
  }
}