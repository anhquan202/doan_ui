export interface ContractInfo {
  id: number
  contract_code: string
  start_date_formatted: string
  end_date_formatted: string
  term_months: number
  deposit: number
  room_name: string
  representative_name: string
  customers_count: number
  status: string
  status_text: string
}

export interface RoomStatistics {
  total_rooms: number
  total_available_rooms: number
  total_occupied_rooms: number
  total_cleaning_rooms: number
  total_repairing_rooms: number
}

export interface ContractsStatistics {
  new_contracts_count: number
  almost_expired_contracts_count: number
  warning_contracts_count: number
  contracts: ContractInfo[]
}

export interface DashboardData {
  room_statistics: RoomStatistics
  contracts_statistics: ContractsStatistics
}

export interface DashboardResponse {
  room_statistics: RoomStatistics
  contracts_statistics: ContractsStatistics
}
