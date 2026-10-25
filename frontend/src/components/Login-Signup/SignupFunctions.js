import api from '../API/api'

export function registerUser(newUserDetails) {
    return api.post('/register', newUserDetails)
}
