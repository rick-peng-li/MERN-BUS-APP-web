const express = require('express');
const Bus = require('../models/Buses');
const Booking = require('../models/Booking');

const router = express.Router();
const TAX_AMOUNT = 150;

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getBookedSeats = async (busId, travelDate) => {
    const query = { bus: busId, status: 'confirmed' };
    if (travelDate) {
        query.travelDate = travelDate;
    }
    const bookings = await Booking.find(query).select('seats');
    return bookings.reduce((allSeats, booking) => allSeats.concat(booking.seats), []);
};

// List of cities used by the search form
router.get('/cities', async (req, res) => {
    try {
        const [startCities, destinations] = await Promise.all([
            Bus.distinct('startCity'),
            Bus.distinct('destination')
        ]);
        res.json({
            startCities: startCities.filter(Boolean).sort(),
            destinations: destinations.filter(Boolean).sort()
        });
    } catch (error) {
        res.status(500).json({ message: 'Unable to load cities' });
    }
});

// Search buses by route (and optionally by date)
router.post('/search', async (req, res) => {
    const { startCity, destination, date } = req.body;

    if (!startCity || !destination) {
        return res.status(400).json({ message: 'Please choose both the starting city and the destination' });
    }

    try {
        const buses = await Bus.find({
            startCity: { $regex: new RegExp(`^${escapeRegex(startCity)}$`, 'i') },
            destination: { $regex: new RegExp(`^${escapeRegex(destination)}$`, 'i') }
        }).lean();

        if (date) {
            const busesWithAvailability = await Promise.all(buses.map(async bus => {
                const bookedSeats = await getBookedSeats(bus._id, date);
                return {
                    ...bus,
                    availableSeats: Math.max(bus.totalSeats - bookedSeats.length, 0)
                };
            }));
            return res.json({ bus: busesWithAvailability });
        }

        return res.json({ bus: buses });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to search buses' });
    }
});

// Single bus details
router.get('/buses/:id', async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        return res.json({ bus });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid bus id' });
    }
});

// Seats that are already taken for the selected bus and date
router.get('/buses/:id/seats', async (req, res) => {
    try {
        const seats = await getBookedSeats(req.params.id, req.query.date);
        return res.json({ seats });
    } catch (error) {
        return res.status(400).json({ message: 'Unable to load seat availability' });
    }
});

// Create a booking and return the generated ticket
router.post('/book', async (req, res) => {
    const { busId, travelDate, seats, passengers } = req.body;

    if (!busId || !travelDate || !Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({ message: 'Bus, travel date and at least one seat are required' });
    }

    if (!Array.isArray(passengers) || passengers.length !== seats.length) {
        return res.status(400).json({ message: 'Passenger details are required for every selected seat' });
    }

    try {
        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        const alreadyBooked = await getBookedSeats(busId, travelDate);
        const conflict = seats.filter(seat => alreadyBooked.includes(seat));
        if (conflict.length > 0) {
            return res.status(409).json({
                message: `Seat ${conflict.join(', ')} is no longer available`,
                seats: conflict
            });
        }

        const transactionId = `UT${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        const totalAmount = bus.pricePerSeat * seats.length + TAX_AMOUNT;

        const booking = await Booking.create({
            transactionId,
            user: req.user._id,
            bus: busId,
            travelDate,
            seats,
            passengers,
            totalAmount
        });

        const populatedBooking = await Booking.populate(booking, { path: 'bus' });

        return res.status(201).json({ booking: populatedBooking });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to complete the booking' });
    }
});

// Ticket details by transaction id
router.get('/ticket/:transactionId', async (req, res) => {
    try {
        const booking = await Booking.findOne({
            transactionId: req.params.transactionId,
            user: req.user._id
        }).populate('bus');

        if (!booking) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        return res.json({ booking });
    } catch (error) {
        return res.status(400).json({ message: 'Unable to load the ticket' });
    }
});

module.exports = router;
