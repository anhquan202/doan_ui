export interface ContractDetailResponse {
  contract: Contract;
}

export interface Contract {
  id: number;
  contract_code: string;
  room_info: RoomInfo;
  customers: Customer[];
}

export interface RoomInfo {
  id: number;
  name: string;
  supplies: Supply[];
  utilities: Utility[];
}

export interface Supply {
  id: number;
  name: string;
  unit: SupplyUnit;
  created_at: string;
  updated_at: string;
}

export type SupplyUnit = 'piece' | 'set' | 'unitless';

export interface Utility {
  id: number;
  utility_type: UtilityType;
  utility_type_label: string;
  fee: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export type UtilityType = | 'electricity' | 'water' | 'internet' | 'parking' | 'garbage' | 'cleaning'

export interface Customer {
  id: number;
  identity_code: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  gender: Gender;
  date_of_birth: string;
  status: CustomerStatus;
  gender_text: string;
  status_text: string;
}

export type Gender = 'male' | 'female' | 'other';

export type CustomerStatus = 'active' | 'inactive';
