const TOKEN_KEY = "token"
const USER_KEY = "user"

const getToken = () => {
    return sessionStorage.getItem(TOKEN_KEY)
}

const setToken = (token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token)
}

const removeToken = () => {
    sessionStorage.removeItem(TOKEN_KEY)
}

const getUser = () => {
    const user = sessionStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
}

const setUser = (user: any) => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

const removeUser = () => {
    sessionStorage.removeItem(USER_KEY)
}

export const sessionStorageHelper = {
    getToken,
    setToken,
    removeToken,
    getUser,
    setUser,
    removeUser
}