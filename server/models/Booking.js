import mongoose from 'mongoose';
import { BOOKING_STATUS } from '../config/constants.js';

const passengerSchema = new mongoose.Schema(
  {
    seat: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    travelDate: { type: String, required: true },
    seats: { type: [String], required: true },
    passengers: { type: [passengerSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.CONFIRMED
    }
  },
  { timestamps: true }
);

bookingSchema.index({ bus: 1, travelDate: 1, status: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
