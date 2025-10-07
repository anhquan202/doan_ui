const TOKEN_KEY = "token"
const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}

const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
}

const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
}

export const localStorageHelper = {
    getToken,
    setToken,
    removeToken
}