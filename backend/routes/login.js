const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { JWTSecret } = require('../config/keys');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const userInfo = {
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            gender: user.gender,
            dob: user.dob
        };

        const token = jwt.sign({ user: userInfo }, JWTSecret, { expiresIn: '1d' });
        return res.status(200).json({ token, user: userInfo });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to sign in, please try again' });
    }
});

module.exports = router;
