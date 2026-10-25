const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

require('./auth/auth');

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const loggedInUserRoute = require('./routes/loggedInUser');
const bookingRoute = require('./routes/routeSelection');

const { MongoURI } = require('./config/keys');

const app = express();

mongoose.connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection failed:', err.message));

const jwtAuth = passport.authenticate('jwt', { session: false });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRoute);
app.use('/register', registerRoute);
app.use('/booking', jwtAuth, bookingRoute);
app.use('/user', jwtAuth, loggedInUserRoute);

// Serve the React build in production and let the router handle deep links
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
