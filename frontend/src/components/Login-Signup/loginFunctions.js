import api, { authHeader } from '../API/api'

export function logUserIn(userCredentials) {
    return api.post('/login', userCredentials)
}

export function getCurrentUserDetails() {
    return api.get('/user/profile', authHeader())
}

export function getMyBookings() {
    return api.get('/user/bookings', authHeader())
}
