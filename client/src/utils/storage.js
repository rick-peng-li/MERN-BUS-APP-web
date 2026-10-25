const TOKEN_KEY = 'ut_token';
const USER_KEY = 'ut_user';
const BOOKING_KEY = 'ut_booking_draft';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = token => localStorage.setItem(TOKEN_KEY, token);

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const setStoredUser = user => localStorage.setItem(USER_KEY, JSON.stringify(user));

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const readBookingDraft = () => {
  try {
    return JSON.parse(sessionStorage.getItem(BOOKING_KEY) || 'null');
  } catch {
    return null;
  }
};

export const writeBookingDraft = draft => sessionStorage.setItem(BOOKING_KEY, JSON.stringify(draft));

export const clearBookingDraft = () => sessionStorage.removeItem(BOOKING_KEY);
