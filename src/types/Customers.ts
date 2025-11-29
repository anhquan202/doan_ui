export type CustomerStatusText =
  | string
  | {
    active: string
    warning: string
    banned: string
  }

export interface Customer {
  id: number
  identity_code: string
  full_name: string
  email: string
  phone: string
  address: string
  gender: 'male' | 'female'
  date_of_birth: string
  status: string | null
  gender_text: string
  status_text: CustomerStatusText
}

export interface PaginationMeta {
  current_page: number
  from: number
  to: number
  per_page: number
  total: number
  total_pages: number
}

export interface CustomersResponseData {
  customers: Customer[]
  meta: PaginationMeta
}

export interface CustomerDetail extends Customer {
  room_name: string
}

export interface CustomerDetailResponseData {
  customer: CustomerDetail
}

export interface EditCustomerPayload {
  id: number
  email: string
  phone: string
  address: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
