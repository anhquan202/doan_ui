export const APP_URL = {
  LOGIN: '/sign_in',
  REGISTER: '/sign_up',
  ROOM: 'rooms',
  CREATE_ROOM: "rooms/create",
  EDIT_ROOM: (id: number) => `rooms/edit/${id}`
}