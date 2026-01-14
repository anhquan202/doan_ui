export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: "/v1/auth/sign_in",
    SIGN_UP: "/v1/auth/sign_up",
    LOGOUT: "/v1/auth/logout",
    PROFILE: "/v1/auth/profile",
  },
  ROOM: {
    STATUS: "/v1/rooms/status",
    LIST: "/v1/rooms",
    SHOW: (id: number | string) => `/v1/rooms/${id}`,
    CREATE: "/v1/rooms",
    EDIT: (id: number | string) => `/v1/rooms/${id}`,
    AVAILABLE: "/v1/rooms/available"
  },
  SUPPLIES: {
    LIST: "/v1/supplies",
    CREATE: "/v1/supplies",
    EDIT: (id: number | string) => `/v1/supplies/${id}`,
  },
  UTILITIES: {
    LIST: "/v1/utilities",
    EDIT: (id: number | string) => `/v1/utilities/${id}`,
  },
  CONTRACTS: {
    LIST: "/v1/contracts",
    CREATE: "/v1/contracts",
    EDIT: (id: number | string) => `/v1/contracts/${id}`,
    SHOW: (id: number | string) => `/v1/contracts/${id}`,
    CHANGE_STATUS: (id: number | string) => `/v1/contracts/${id}/status`,
  },
  CUSTOMERS: {
    LIST: "/v1/customers",
    DETAIL: (id: number | string) => `/v1/customers/${id}`,
    CREATE: "/v1/customers",
    EDIT: (id: number | string) => `/v1/customers/${id}`
  },
  VEHICLES: {
    LIST: "/v1/vehicles",
    TOGGLE_ACTIVE: (id: number | string) => `/v1/vehicles/${id}/active`
  },
  METER_READINGS: {
    LIST: "/v1/meter_reading",
    IMPORT: "/v1/meter_reading/import/xlsx"
  },
  MONTHLY_INVOICES: {
    LIST: "/v1/monthly_invoices"
  },
  DASHBOARD: {
    SUMMARY: '/v1/dashboard/summary'
  }
} as const
