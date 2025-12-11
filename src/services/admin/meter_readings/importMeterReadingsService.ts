import { networkManager } from '@/api/axiosConfig'
import { API_ENDPOINTS } from '@/constants/apiPath'

export const importMeterReadingsService = async (file: File) => {
  const formData = new FormData()
  formData.append('meter_file', file)

  // Use networkManager so interceptors, baseURL and auth are applied
  return networkManager.post(API_ENDPOINTS.METER_READINGS.IMPORT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
