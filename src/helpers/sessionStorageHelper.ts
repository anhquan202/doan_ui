const TOKEN_KEY = "token"
const getToken = () => {
    return sessionStorage.getItem(TOKEN_KEY)
}

const setToken = (token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token)
}

const removeToken = () => {
    sessionStorage.removeItem(TOKEN_KEY)
}

export const sessionStorageHelper = {
    getToken,
    setToken,
    removeToken
}