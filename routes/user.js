
const express = require('express')
const router = express.Router()
const passport = require('passport');
const User =  require('../models/user')
const user = require('../controllers/user')
const catchAsync = require('../utils/catchAsync')

const { storeReturnTo } = require('../middleware');



router.route('/register') 
        .get(catchAsync(user.register))
        .post(catchAsync(user.regFail))


router.route('/login')
        .get(catchAsync(user.login)) 
        .post(storeReturnTo,passport.authenticate('local',{failureFlash:true , failureRedirect:'/login'}) ,(req,res)=>{
        req.flash('success','welcome to yelpcamp')
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        delete req.session.returnTo;
        res.redirect(redirectUrl)
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/register', failureFlash: true }), (req, res) => {
    req.flash('success', 'Welcome To Yelpcamp!');
    res.redirect('/campgrounds');
});


module.exports = router