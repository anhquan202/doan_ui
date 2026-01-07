import { networkManager } from "@/api/axiosConfig"
import { mapStep2ToApi, type Step2Data, type Step2Response } from "@/types/ContractWizard"

export const step2Service = async (data: Step2Data) => {
  try {
    const payload = mapStep2ToApi(data)
    const res = await networkManager.post<Step2Response>('/v1/contract_wizard/step2', payload)
    return res
  } catch (error) {
    throw error
  }
}