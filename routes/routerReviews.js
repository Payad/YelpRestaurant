// const express = require('express');
// const routerReviews = express.Router({mergeParams: true});
// const Restaurant = require('../models/restaurant');
// const Review = require('../models/reviews');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/AppError');
// // const {restaurantSchema, reviewSchema} = require('../schemas.js');
// const {reviewSchema} = require('../schemas.js');


// const validateReview = (req, res, next) => {
//     const {error} = reviewSchema.validate(req.body)
//     if(error) {
//     const msg = error.details.map((el => el.message)).join(',')
//     throw new AppError(msg, 404)
// } else {
//     next();
// }
// }


// routerReviews.post('/restaurants/:id/reviews', validateReview, async(req, res) => {
// // routerReviews.post('/', validateReview, async(req, res) => {
//     // res.send('You made it');
//     const restaurant = await Restaurant.findById(req.params.id);
//     const review = new Review(req.body.review);
//     restaurant.review.push(review);
//     await review.save();
//     await restaurant.save();
//     res.redirect(`/restaurants/${restaurant._id}`);
//     // const {id} = req.params;
//     // const review = req.body.restaurant;
// })

// // routerReviews.delete('/restaurants/:id/reviews/:reviewId', catchAsync(async(req, res, next) => {
// routerReviews.delete('/:reviewId', catchAsync(async(req, res, next) => {
// // console.log("Deleted!!")
//     const {id, reviewId} = req.params;
// //     if (!ObjectId.isValid(id)) {
// //     next(new AppError('Invalid id', 404))
// // } else {
//     // const {id, reviewId} = req.params;
//     await Restaurant.findByIdAndUpdate(id, {$pull: {review: reviewId}})
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/restaurants/${id}`);
//     // res.send('Delete Me')
// // }
// }));

// module.exports = routerReviews;
/////////////////////END END END END??????///////////////////////////

const express = require("express");
const router = express.Router({ mergeParams: true });
 
const Restaurant = require("../models/restaurant");
const Review = require("../models/reviews");
const {isLoggedIn} = require('../middleware');
 
const { reviewSchema } = require("../schemas.js");
 
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
 
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};
 
// CREATE 
router.post(
  "/restaurants/:id/reviews", isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    restaurant.review.push(review);
    await review.save();
    await restaurant.save();
    req.flash('success', 'Successfully made a new review')
    res.redirect(`/restaurants/${restaurant.id}`);
  })
);
 
// DELETE 
router.delete(
  "/restaurants/:id/reviews/:reviewId", isLoggedIn,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/restaurants/${restaurant._id}`);
  })
);
 
module.exports = router;