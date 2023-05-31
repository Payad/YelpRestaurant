const express = require('express');
const router = express.Router();
// const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const users = require('../controllers/users');

router.get('/register', users.register
// (req, res) => {
//     res.render('users/register');
// }
)

router.post('/register', catchAsync(users.createUser
// async(req, res, next) => {
//     try {
//     const {username, email, password} = req.body;
//     // res.send(req.body);
//     const newUser = new User({username, email});
//     const registeredUser = await User.register(newUser, password);
//     //req.login requires a callback function
//     req.login(registeredUser, err => {
//         if(err) return next();
//     req.flash('success', 'Welcome to Yelp Restaurant')
//     res.redirect('/restaurants');
// })
//     console.log(registeredUser)
//     // req.flash('success', 'Welcome to YelpRestaurant')
//     // res.redirect('/restaurants');
//     // res.redirect('/register');
//     } catch(e) {
//         req.flash('error', e.message);
//         res.redirect('/register')
// }
//         // console.log(e)
// //     req.flash('success', 'Welcome to YelpRestaurant')
// // res.redirect('/restaurants');

// }
))

router.get('/login', users.renderFormLogin
// (req, res) => {
//     res.render('users/login');
// }
);

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.loginUser
// (req, res) => {
//     req.flash('success', 'Welcome Back!');
// const redirectUrl = res.locals.returnTo || '/restaurants';
// delete req.session.returnTo;
// return res.redirect(redirectUrl);
//     // res.redirect('/restaurants')
    
// }
)

// router.get('/logout', (req, res, next) => {
//     req.logout(function(error) {
//         if(error) {
//     return next(error)
// }
//  req.flash('success', 'You signed out');
//     res.redirect('/restaurants');
// })
//     // req.flash('success', 'You signed out');
//     // res.redirect('/restaurants');
// })
// router.get('/logout', function(req, res, next) {
//   req.logout(function(err) {
//     if (err) { return next(err); }
//     req.flash('success', 'you signed out');
//     res.redirect('/restaurants');
//     // res.redirect('/restaurants');
//   });
//     // req.flash('success', 'you signed out');
//     // res.redirect('/restaurants');
// });

router.get('/logout', users.logoutUser
// (req, res, next) => {
//     req.logout((err) => {
//         if (err) {
//             return next(err);
//         }
//         req.flash('success', "Goodbye!");
//         console.log('logged out')
//         return res.redirect('/restaurants');
        

//     });
 
// }
);

// router.get('/logout', (req, res) => {
//     req.logout();
// req.flash('success', "GoodBye");
// res.redirect('/restaurants')
// })

module.exports = router;