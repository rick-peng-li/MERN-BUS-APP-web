const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    busType: {
        type: String,
        required: true
    },
    busNumber: {
        type: String,
        required: true
    },
    startCity: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    pricePerSeat: {
        type: Number,
        required: true
    }
}, { collection: 'buses' });

const Bus = mongoose.model('bus', BusSchema);

module.exports = Bus;
