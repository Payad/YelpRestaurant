const express = require('express');
const router = express.Router({mergeParams: true});
const Restaurant = require('../models/restaurant');
// const Review = require('../models/reviews');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
// const {restaurantSchema, reviewSchema} = require('../schemas.js');
const {restaurantSchema} = require('../schemas.js');
const ObjectId = require('mongoose').Types.ObjectId;


const validateRestaurant = (req, res, next) => {
const {error} = restaurantSchema.validate(req.body);
// console.log(result);
// if (!req.body.restaurant) {
//     next(new AppError('Invalid Restaurant Data', 404))
// } else {
if(error) {
    const msg = error.details.map((el => el.message)).join(',')
    throw new AppError(msg, 404)
} else {
    next();
}
}

// // const validateReview = (req, res, next) => {
// //     const {error} = reviewSchema.validate(req.body)
// //     if(error) {
// //     const msg = error.details.map((el => el.message)).join(',')
// //     throw new AppError(msg, 404)
// // } else {
// //     next();
// // }
// // }


router.get('/restaurants', async (req, res) => {
    // const restaurant = new Restaurant.find({});
    const restaurants = await Restaurant.find();
    res.render('restaurants/index', {restaurants})
});

router.get('/restaurants/new', (req, res) => {
    res.render('restaurants/new');
})

router.post('/restaurants', validateRestaurant, catchAsync(async (req, res, next) => {
// try {

//can write own error handler but use joi validation instead
// if(!req.body.restaurant.title) {
//     next(new AppError('invalid restaurant title data', 404))
// }
const restaurant = new Restaurant(req.body.restaurant);
await restaurant.save();
res.redirect(`restaurants/${restaurant._id}`)
// }
// } catch (e) {
//     next(e)
// }
// res.send(req.body)
}));

router.get('/restaurants/:id', catchAsync(async (req, res, next) => {
const {id} = req.params;
// if (foundId) {
const foundId = await Restaurant.findById(req.params.id).populate('review');
    // res.render('restaurants/show', {foundId});
// console.log(foundId);
    res.render('restaurants/show', {foundId})
// } else {
if (!ObjectId.isValid(id)) {
    next(new AppError('Invalid Id', 404))
}
}));

router.get('/restaurants/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const restaurant = await Restaurant.findById(id);
    res.render('restaurants/edit', {restaurant});
}));

router.put('/restaurants/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
res.redirect(`/restaurants/${restaurant._id}`)
// res.send('It worked')
}));

router.delete('/restaurants/:id', catchAsync(async (req, res) => {
const {id} = req.params;
await Restaurant.findByIdAndDelete(id);
res.redirect('/restaurants');
}));

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