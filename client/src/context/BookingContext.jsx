import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@/utils/constants';
import {
  clearBookingDraft,
  readBookingDraft,
  writeBookingDraft
} from '@/utils/storage';

const createEmptyDraft = () => ({
  startCity: '',
  destination: '',
  travelDate: dayjs().format(DATE_FORMAT),
  bus: null,
  seats: [],
  passengers: []
});

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [draft, setDraft] = useState(() => readBookingDraft() || createEmptyDraft());

  useEffect(() => {
    writeBookingDraft(draft);
  }, [draft]);

  const updateTrip = useCallback(patch => {
    setDraft(previous => ({ ...previous, ...patch }));
  }, []);

  const selectBus = useCallback(bus => {
    setDraft(previous => ({ ...previous, bus, seats: [], passengers: [] }));
  }, []);

  const clearBus = useCallback(() => {
    setDraft(previous => ({ ...previous, bus: null, seats: [], passengers: [] }));
  }, []);

  const toggleSeat = useCallback(seat => {
    setDraft(previous => {
      const isSelected = previous.seats.includes(seat);
      if (isSelected) {
        return {
          ...previous,
          seats: previous.seats.filter(item => item !== seat),
          passengers: previous.passengers.filter(item => item.seat !== seat)
        };
      }

      return {
        ...previous,
        seats: [...previous.seats, seat],
        passengers: [...previous.passengers, { seat, name: '', gender: 'Male' }]
      };
    });
  }, []);

  const updatePassenger = useCallback((seat, patch) => {
    setDraft(previous => ({
      ...previous,
      passengers: previous.passengers.map(passenger =>
        passenger.seat === seat ? { ...passenger, ...patch } : passenger
      )
    }));
  }, []);

  const clearBooking = useCallback(() => {
    const empty = createEmptyDraft();
    setDraft(empty);
    clearBookingDraft();
  }, []);

  const value = useMemo(
    () => ({ draft, updateTrip, selectBus, clearBus, toggleSeat, updatePassenger, clearBooking }),
    [draft, updateTrip, selectBus, clearBus, toggleSeat, updatePassenger, clearBooking]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used inside a BookingProvider');
  }
  return context;
};
