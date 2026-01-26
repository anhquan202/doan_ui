export type ISODate = string;      // yyyy-mm-dd
export type ISODateTime = string;  // ISO 8601 datetime

export enum Gender {
  Male = 0,
  Female = 1,
}

export interface Step0Supply {
  supply_id: number
  quantity?: number
}

export interface Step0Utility {
  utility_id: number
}

export interface Step0Data {
  room_id: number
  supplies?: Step0Supply[]
  utilities?: Step0Utility[]
}

export interface Step0Response {
  success: true
  message: string
  data: {
    draft_id: number
    current_step: number
    room_id: number
    supplies_count: number
    utilities_count: number
    expires_at: ISODateTime
  }
}

export interface VehicleData {
  vehicleId: number;
  plateNumber: string;
}

export interface Step1Customer {
  identityCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  gender: Gender;
  dateOfBirth: ISODate;
  isRepresent: boolean;
  vehicle?: VehicleData;
}

export interface Step1Data {
  roomId: number;
  draftId?: number;
  customers: Step1Customer[];
}

export interface Step1Response {
  success: true;
  message: string;
  data: {
    draft_id: number;
    currentStep: 1;
    roomId: number;
    customersCount: number;
    expiresAt: ISODateTime;
  };
}

export interface Step2Data {
  draftId: number;
  startDate: ISODate;
  termMonths: number;
  deposit: number;
}

export interface Step2Response {
  success: true;
  message: string;
  data: {
    draftId: number;
    currentStep: 2;
    startDate: ISODate;
    endDate: ISODate;
    termMonths: number;
    deposit: number;
  };
}

export interface Step3Data {
  draftId: number;
}

export type ContractStatus = "active" | "pending" | "cancelled";

export interface Step3Response {
  success: true;
  message: string;
  data: {
    contractId: number;
    contractCode: string;
    status: ContractStatus;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export function mapStep1ToApi(data: Step1Data) {
  return {
    room_id: data.roomId,
    draft_id: data.draftId,
    customers: data.customers.map(c => ({
      identity_code: c.identityCode,
      first_name: c.firstName,
      last_name: c.lastName,
      email: c.email,
      phone: c.phone,
      address: c.address,
      gender: c.gender,
      date_of_birth: c.dateOfBirth,
      is_represent: c.isRepresent,
      vehicle: c.vehicle
        ? {
            vehicle_id: c.vehicle.vehicleId,
            plate_number: c.vehicle.plateNumber,
          }
        : undefined,
    })),
  };
}

export function mapStep2ToApi(data: Step2Data) {
  return {
    draft_id: data.draftId,
    start_date: data.startDate,
    term_months: data.termMonths,
    deposit: data.deposit,
  }
}

export function mapStep3ToApi(data: Step3Data) {
  return {
    draft_id: data.draftId,
  }
}