import api, { authHeader } from '../API/api'

export function getCitiesFromApi() {
    return api.get('/booking/cities', authHeader())
}

export function getRoutesFromApi(startCity, destination, date) {
    return api.post('/booking/search', { startCity, destination, date }, authHeader())
}

export function getBusFromApi(busId) {
    return api.get(`/booking/buses/${busId}`, authHeader())
}

export function getBookedSeatsFromApi(busId, date) {
    return api.get(`/booking/buses/${busId}/seats`, {
        ...authHeader(),
        params: { ...(authHeader().params || {}), date }
    })
}

export function createBookingApi(payload) {
    return api.post('/booking/book', payload, authHeader())
}

export function getTicketFromApi(transactionId) {
    return api.get(`/booking/ticket/${transactionId}`, authHeader())
}
