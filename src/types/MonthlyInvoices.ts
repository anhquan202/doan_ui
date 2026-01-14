export interface MeterReadingDetail {
  id: number
  contract_id: number
  start_num: number
  end_num: number
  fee_at_reading: number
  total_fee: number
  month: number
  year: number
  created_at: string
  updated_at: string
}

export interface MonthlyInvoice {
  id: number
  contract_id: number
  contract_code: string
  room_name: string
  water_reading: MeterReadingDetail
  electric_reading: MeterReadingDetail
  month: number
  year: number
  period_text: string
  room_fee: number
  electric_fee: number
  water_fee: number
  service_fee: number
  service_details: Record<string, unknown>
  adjustment: number
  adjustment_note: string | null
  total_amount: number
  status: string
  status_text: string
  paid_at: string | null
  payment_method: string | null
  note: string | null
  created_at: string
  updated_at: string
}

export interface MonthlyInvoiceMeta {
  current_page: number
  from: number
  to: number
  per_page: number
  total: number
  total_pages: number
}

export interface MonthlyInvoicesResponse {
  invoices: MonthlyInvoice[]
  meta: MonthlyInvoiceMeta
}

export interface MonthlyInvoicesParams {
  page?: number
  per_page?: number
  month?: number
  year?: number
  status?: string
  contract_id?: number
}
