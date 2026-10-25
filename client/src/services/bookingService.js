import api from './api';

export const getCities = async () => {
  const { data } = await api.get('/booking/cities');
  return data;
};

export const searchBuses = async payload => {
  const { data } = await api.post('/booking/search', payload);
  return data;
};

export const getBus = async busId => {
  const { data } = await api.get(`/booking/buses/${busId}`);
  return data;
};

export const getBookedSeats = async (busId, date) => {
  const { data } = await api.get(`/booking/buses/${busId}/seats`, { params: { date } });
  return data;
};

export const createBooking = async payload => {
  const { data } = await api.post('/booking/book', payload);
  return data;
};

export const getTicket = async transactionId => {
  const { data } = await api.get(`/booking/ticket/${transactionId}`);
  return data;
};
