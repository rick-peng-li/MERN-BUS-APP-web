import { Booking } from '../models/Booking.js';

export const getProfile = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).select('seats totalAmount');

  const stats = bookings.reduce(
    (acc, booking) => {
      acc.totalBookings += 1;
      acc.totalSeats += booking.seats.length;
      acc.totalSpent += booking.totalAmount;
      return acc;
    },
    { totalBookings: 0, totalSeats: 0, totalSpent: 0 }
  );

  res.json({ user: req.user.toPublicJSON(), stats });
};

export const getBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('bus')
    .sort({ createdAt: -1 });

  res.json({ bookings });
};
