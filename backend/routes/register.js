const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, password, mobile, gender, dob } = req.body;

    if (!name || !email || !password || !mobile || !gender) {
        return res.status(400).json({ message: 'All fields except date of birth are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'This email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mobile,
            gender,
            dob: dob ? moment(dob).format('YYYY-MM-DD') : undefined
        });

        const result = await newUser.save();
        return res.status(201).json({
            _id: result._id,
            name: result.name,
            email: result.email,
            mobile: result.mobile,
            gender: result.gender,
            dob: result.dob
        });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to register, please try again' });
    }
});

module.exports = router;
