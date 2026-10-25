const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PassengerSchema = new Schema({
    seat: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true }
}, { _id: false });

const BookingSchema = new Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    bus: {
        type: Schema.Types.ObjectId,
        ref: 'bus',
        required: true
    },
    travelDate: {
        type: String,
        required: true
    },
    seats: {
        type: [String],
        required: true
    },
    passengers: {
        type: [PassengerSchema],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    }
}, { collection: 'bookings', timestamps: true });

const Booking = mongoose.model('booking', BookingSchema);

module.exports = Booking;
