import { networkManager } from "@/api/axiosConfig"
import { mapStep1ToApi, type Step1Data, type Step1Response } from "@/types/ContractWizard"

export const step1Service = async (data: Step1Data) => {
  try {
    const payload = mapStep1ToApi(data)
    const res = await networkManager.post<Step1Response>('/v1/contract_wizard/step1', payload)
    return res
  } catch (error) {
    throw error
  }
}