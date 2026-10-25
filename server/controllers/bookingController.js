import { Bus } from '../models/Bus.js';
import { Booking } from '../models/Booking.js';
import { BOOKING_STATUS, TAX_AMOUNT } from '../config/constants.js';
import { ApiError } from '../utils/ApiError.js';
import { escapeRegex, generateTransactionId } from '../utils/ticket.js';

const findBookedSeats = async (busId, travelDate) => {
  const query = { bus: busId, status: BOOKING_STATUS.CONFIRMED };
  if (travelDate) {
    query.travelDate = travelDate;
  }
  const bookings = await Booking.find(query).select('seats').lean();
  return bookings.flatMap(booking => booking.seats);
};

export const getCities = async (req, res) => {
  const [startCities, destinations] = await Promise.all([
    Bus.distinct('startCity'),
    Bus.distinct('destination')
  ]);

  res.json({
    startCities: startCities.filter(Boolean).sort(),
    destinations: destinations.filter(Boolean).sort()
  });
};

export const searchBuses = async (req, res) => {
  const { startCity, destination, date } = req.body;

  if (!startCity || !destination) {
    throw ApiError.badRequest('Please choose both the starting city and the destination');
  }

  const exactMatch = value => new RegExp(`^${escapeRegex(value)}$`, 'i');
  const buses = await Bus.find({
    startCity: exactMatch(startCity),
    destination: exactMatch(destination)
  }).lean();

  if (!date) {
    return res.json({ buses });
  }

  const busesWithAvailability = await Promise.all(
    buses.map(async bus => {
      const bookedSeats = await findBookedSeats(bus._id, date);
      return {
        ...bus,
        availableSeats: Math.max(bus.totalSeats - bookedSeats.length, 0)
      };
    })
  );

  res.json({ buses: busesWithAvailability });
};

export const getBusById = async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    throw ApiError.notFound('Bus not found');
  }
  res.json({ bus });
};

export const getBookedSeats = async (req, res) => {
  const seats = await findBookedSeats(req.params.id, req.query.date);
  res.json({ seats });
};

export const createBooking = async (req, res) => {
  const { busId, travelDate, seats, passengers } = req.body;

  if (!busId || !travelDate || !Array.isArray(seats) || seats.length === 0) {
    throw ApiError.badRequest('Bus, travel date and at least one seat are required');
  }

  if (!Array.isArray(passengers) || passengers.length !== seats.length) {
    throw ApiError.badRequest('Passenger details are required for every selected seat');
  }

  const bus = await Bus.findById(busId);
  if (!bus) {
    throw ApiError.notFound('Bus not found');
  }

  const bookedSeats = await findBookedSeats(bus._id, travelDate);
  const conflicts = seats.filter(seat => bookedSeats.includes(seat));
  if (conflicts.length > 0) {
    throw ApiError.conflict(`Seat ${conflicts.join(', ')} is no longer available`, {
      seats: conflicts
    });
  }

  const booking = await Booking.create({
    transactionId: generateTransactionId(),
    user: req.user._id,
    bus: bus._id,
    travelDate,
    seats,
    passengers,
    totalAmount: bus.pricePerSeat * seats.length + TAX_AMOUNT
  });

  const populatedBooking = await booking.populate('bus');
  res.status(201).json({ booking: populatedBooking });
};

export const getTicket = async (req, res) => {
  const booking = await Booking.findOne({
    transactionId: req.params.transactionId,
    user: req.user._id
  }).populate('bus');

  if (!booking) {
    throw ApiError.notFound('Ticket not found');
  }

  res.json({ booking });
};
