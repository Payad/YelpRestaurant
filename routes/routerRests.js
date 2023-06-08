const express = require('express');
const router = express.Router({mergeParams: true});
const Restaurant = require('../models/restaurant');
// const Review = require('../models/reviews');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/AppError');
// const {restaurantSchema, reviewSchema} = require('../schemas.js');
const {restaurantSchema} = require('../schemas.js');
// const ObjectId = require('mongoose').Types.ObjectId;
const {isLoggedIn, isAuthor, validateRestaurant} = require('../middleware');
const restaurants = require('../controllers/restaurants');
const multer = require('multer');
// const upload = multer({dest: 'uploads/'});
const {storage} = require('../cloudinary');
const upload = multer({storage});

// const validations = require('/javascripts/validations');

// const isAuthor = async(req, res, next) => {
// const {id} = req.params;
// const restaurant = await Restaurant.findById(id);
// if (!restaurant.author.equals(req.user._id)) {
//     req.flash('error', 'You do not have permission to do that')
//     return res.redirect(`/restaurants/${id}`);
// }
//     next();
// }

// const validateRestaurant = (req, res, next) => {
// const {error} = restaurantSchema.validate(req.body);
// // console.log(result);
// // if (!req.body.restaurant) {
// //     next(new AppError('Invalid Restaurant Data', 404))
// // } else {
// if(error) {
//     const msg = error.details.map((el => el.message)).join(',')
//     throw new AppError(msg, 404)
// } else {
//     next();
// }
// }

// // const validateReview = (req, res, next) => {
// //     const {error} = reviewSchema.validate(req.body)
// //     if(error) {
// //     const msg = error.details.map((el => el.message)).join(',')
// //     throw new AppError(msg, 404)
// // } else {
// //     next();
// // }
// // }


router.get('/restaurants', restaurants.restaurantIndex
// async (req, res) => {
//     // const restaurant = new Restaurant.find({});
//     const restaurants = await Restaurant.find();
//     res.render('restaurants/index', {restaurants})
// }
);

router.get('/restaurants/new', isLoggedIn, restaurants.renderNew
// (req, res) => {
// //     if(!req.isAuthenticated()) {
// //     req.flash('error', 'You must be Logged in');
// //     return res.redirect('/login');
// // }
//     res.render('restaurants/new');
// }
)

router.post('/restaurants', isLoggedIn, upload.array('image'), validateRestaurant, catchAsync(restaurants.createNew
// router.post('/restaurants', upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('It worked');
// })
// async (req, res, next) => {
// // try {

// //can write own error handler but use joi validation instead
// // if(!req.body.restaurant.title) {
// //     next(new AppError('invalid restaurant title data', 404))
// // }
// const restaurant = new Restaurant(req.body.restaurant);
// restaurant.author = req.user._id;
// await restaurant.save();
// req.flash('success', 'Successfully made a new restaurant')
// // res.redirect(`restaurants/${restaurant._id}`)
// res.redirect(`/restaurants/${restaurant._id}`)
// // }
// // } catch (e) {
// //     next(e)
// // }
// // res.send(req.body)
// }
));

router.get('/restaurants/:id', isLoggedIn, catchAsync(restaurants.renderShow
// async (req, res, next) => {
// const {id} = req.params;
// // if (foundId) {
// const foundId = await Restaurant.findById(req.params.id).populate({
// //using nesting to populate owner of review
// path: 'review',
// populate: {
//     path: 'author'
// }}).populate('author');
//     // res.render('restaurants/show', {foundId});
// console.log(foundId);
// if (!foundId) {
// req.flash('error', 'Cannot find restaurant');
// return res.redirect('/restaurants');
// }
//     res.render('restaurants/show', {foundId})
// // } else {
// if (!ObjectId.isValid(id)) {
//     next(new AppError('Invalid Id', 404))
// }
// }
));

router.get('/restaurants/:id/edit', isLoggedIn, isAuthor, catchAsync(restaurants.renderEdit
// async (req, res) => {
//     const {id} = req.params;
//     const restaurant = await Restaurant.findById(id);
//     if (!restaurant) {
//     req.flash('error', 'Cannot find restaurant');
//     return res.redirect('/restaurants');
//     }
//     res.render('restaurants/edit', {restaurant});
// }
));

router.put('/restaurants/:id', isLoggedIn, isAuthor, upload.array('image'), validateRestaurant, catchAsync(restaurants.renderUpdate
// async (req, res) => {
//     const {id} = req.params;
// // const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
// // const restaurant = await Restaurant.findById(id);
// // if (!restaurant.author.equals(req.user._id)) {
// //     req.flash('error', 'You do not have permission to do that')
// //     return res.redirect(`/restaurants/${id}`);
// // }
// const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
// req.flash('success', 'Successfully updated restaurant')
// res.redirect(`/restaurants/${restaurant._id}`)
// // res.send('It worked')
// }
));

router.delete('/restaurants/:id', isLoggedIn, catchAsync(restaurants.deleteRestaurant
// async (req, res) => {
// const {id} = req.params;
// await Restaurant.findByIdAndDelete(id);
// req.flash('success', 'successfully deleted restaurant');
// res.redirect('/restaurants');
// }
));

// //REVIEWS
// // router.post('/restaurants/:id/reviews', validateReview, async(req, res) => {
// //     // res.send('You made it');
// //     const restaurant = await Restaurant.findById(req.params.id);
// //     const review = new Review(req.body.review);
// //     restaurant.review.push(review);
// //     await review.save();
// //     await restaurant.save();
// //     res.redirect(`/restaurants/${restaurant._id}`);
// //     // const {id} = req.params;
// //     // const review = req.body.restaurant;
// // })

// // router.delete('/restaurants/:id/reviews/:reviewId', catchAsync(async(req, res, next) => {
// // // console.log("Deleted!!")
// //     const {id, reviewId} = req.params;
// // //     if (!ObjectId.isValid(id)) {
// // //     next(new AppError('Invalid id', 404))
// // // } else {
// //     // const {id, reviewId} = req.params;
// //     await Restaurant.findByIdAndUpdate(id, {$pull: {review: reviewId}})
// //     await Review.findByIdAndDelete(reviewId);
// //     res.redirect(`/restaurants/${id}`);
// //     // res.send('Delete Me')
// // // }
// // }));



// // router.all('*', (req, res, next) => {
// //     // res.send('404');
// //     next(new AppError('Page Not Found', 404))
// // })

// // router.use((err, req, res, next) => {
// //     // res.send('Oh boy something went wrong!')
// // // const {status = 500, message = "Something went wrong"} = err
// // const {status = 500} = err;
// // if(!err.message) err.message = 'Oh no, Something went wrong';
// // // res.status(status).send(message);
// // res.status(status).render('error', {err})
// // // res.send('oh boy something went wrong');
// // })

// // router.listen(3000, () => {
// //     console.log('Listening on port 3000')
// // })

module.exports = router;