const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async(req, res, next) => {
    try {
    const {username, email, password} = req.body;
    // res.send(req.body);
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
        if(err) return next();
    req.flash('success', 'Welcome to YelpRestaurant')
    res.redirect('/restaurants');
})
    console.log(registeredUser)
    // req.flash('success', 'Welcome to YelpRestaurant')
    // res.redirect('/restaurants');
    // res.redirect('/register');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register')
}
        // console.log(e)
//     req.flash('success', 'Welcome to YelpRestaurant')
// res.redirect('/restaurants');

}))

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    req.flash('success', 'Welcome Back!');
const redirectUrl = res.locals.returnTo || '/restaurants';
res.redirect(redirectUrl);
    // res.redirect('/restaurants')
    
})

router.get('/logout', (req, res, next) => {
    req.logout(function(error) {
        if(error) {
    return next(error)
}
 req.flash('success', 'You signed out');
    res.redirect('/restaurants');
})
    // req.flash('success', 'You signed out');
    // res.redirect('/restaurants');
})

module.exports = router;