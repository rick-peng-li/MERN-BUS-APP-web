/**
 * Seeds the MongoDB database with demo buses and a demo user.
 * Run with: npm run seed
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Bus = require('../models/Buses');
const User = require('../models/User');
const Booking = require('../models/Booking');
const buses = require('../data/buses.json');
const { MongoURI } = require('../config/keys');

const DEMO_USER = {
    name: 'Demo User',
    email: 'demo@uniquetravels.com',
    password: 'demo1234',
    mobile: '9876543210',
    gender: 'Male'
};

const run = async () => {
    await mongoose.connect(MongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    await Promise.all([Bus.deleteMany({}), Booking.deleteMany({})]);
    await Bus.insertMany(buses);
    console.log(`Inserted ${buses.length} buses`);

    const hashedPassword = await bcrypt.hash(DEMO_USER.password, 10);
    await User.findOneAndUpdate(
        { email: DEMO_USER.email },
        { ...DEMO_USER, password: hashedPassword },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`Demo user ready: ${DEMO_USER.email} / ${DEMO_USER.password}`);

    await mongoose.disconnect();
    console.log('Seed completed');
};

run().catch(err => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
