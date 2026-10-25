const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { JWTSecret } = require('../config/keys');

// Email + password strategy used by POST /login
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Wrong password' });
        }

        return done(null, user, { message: 'Logged in successfully' });
    } catch (error) {
        return done(error);
    }
}));

// JWT strategy. The token can be sent as a query parameter or a Bearer header.
passport.use(new JWTstrategy({
    secretOrKey: JWTSecret,
    jwtFromRequest: ExtractJWT.fromExtractors([
        ExtractJWT.fromUrlQueryParameter('secret_token'),
        ExtractJWT.fromAuthHeaderAsBearerToken()
    ])
}, async (token, done) => {
    try {
        return done(null, token.user);
    } catch (error) {
        return done(error);
    }
}));
