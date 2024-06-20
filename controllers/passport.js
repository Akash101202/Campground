

const passport = require('passport');
const express = require('express')
const User = require('../models/user');
const router = express.Router()
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '116707197765-jusafdodmekf9idftrbvr8d8pkhaertd.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://campground-dquz.onrender.com/auth/campgrounds/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
