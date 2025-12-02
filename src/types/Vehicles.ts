export interface Vehicle {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export interface VehicleResponse {
  vehicles: Vehicle[]
}