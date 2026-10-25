const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

// Information about the signed-in user
router.get('/profile', (req, res) => {
    res.json({ user: req.user });
});

// Bookings that belong to the signed-in user
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('bus')
            .sort({ createdAt: -1 });
        res.json({ bookings });
    } catch (error) {
        res.status(500).json({ message: 'Unable to load bookings' });
    }
});

module.exports = router;
