export interface ElectricReading {
  id: number
  start_num: number
  end_num: number
  fee_at_reading: number
  total_fee: number
  month: number
  year: number
  created_at: string
  updated_at: string
}

export interface WaterReading {
  id: number
  start_num: number
  end_num: number
  fee_at_reading: number
  total_fee: number
  month: number
  year: number
  created_at: string
  updated_at: string
}

export interface MeterReading {
  contract_id: number
  contract_code: string
  fee_services: number
  electric_readings: ElectricReading[]
  water_readings: WaterReading[]
}

export interface MeterReadingMeta {
  current_page: number
  from: number
  to: number
  per_page: number
  total: number
  total_pages: number
}

export interface MeterReadingResponse {
  meter_readings: MeterReading[]
  meta: MeterReadingMeta
}

export interface MeterReadingParams {
  page?: number
  per_page?: number
  month?: number
  year?: number
}
