import axios from 'axios'

const baseURL = process.env.REACT_APP_API_URL || ''

const api = axios.create({ baseURL })

// Adds the JWT saved at login to every request that needs authentication
export const authHeader = () => {
    const token = sessionStorage.getItem('authToken')
    return token ? { params: { secret_token: token } } : {}
}

export default api
