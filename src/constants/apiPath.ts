export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: "/v1/auth/sign_in",
    SIGN_UP: "/v1/auth/sign_up",
    LOGOUT: "/v1/auth/logout",
    PROFILE: "/v1/auth/profile",
  },
  ROOM: {
    LIST: "/v1/rooms",
    SHOW: (id: number | string) => `/v1/rooms/${id}`,
    CREATE: "/v1/rooms",
    UPDATE: (id: number | string) => `/v1/rooms/${id}`,
  },
  SUPPLIES: {
    LIST: "/v1/supplies"
  },
  UTILITIES: {
    LIST: "/v1/utilities"
  }
} as const
