// const passport_auth = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
// const User = require('../models/user') // Your user model

// // Serialize user
// // Serialize user
// passport_auth.serializeUser((user, done) => {
//     done(null, user.id);
// });

// // Deserialize user
// passport_auth.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });

// // Google OAuth Strategy
// passport_auth.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback"
// }, (token, tokenSecret, profile, done) => {
//     User.findOrCreate({ googleId: profile.id }, (err, user) => {
//         return done(err, user);
//     });
// }));

// // Facebook OAuth Strategy
// passport_auth.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_CLIENT_ID,
//     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     callbackURL: "/auth/facebook/callback"
// }, (accessToken, refreshToken, profile, done) => {
//     User.findOrCreate({ facebookId: profile.id }, (err, user) => {
//         return done(err, user);
//     });
// }));

// module.exports = passport_auth;
