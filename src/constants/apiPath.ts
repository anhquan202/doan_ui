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
  },
  SUPPLIES: {
    LIST: "/v1/supplies",
    CREATE: "/v1/supplies",
    EDIT: (id: number | string) => `/v1/supplies/${id}`,
  },
  UTILITIES: {
    LIST: "/v1/utilities",
    EDIT: (id: number | string) => `/v1/utilities/${id}`,
  }
} as const
