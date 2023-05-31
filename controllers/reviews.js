const Review = require('../models/reviews');
const Restaurant = require('../models/restaurant');

module.exports.createReview = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    restaurant.review.push(review);
    await review.save();
    await restaurant.save();
    req.flash('success', 'Successfully created a new review')
    res.redirect(`/restaurants/${restaurant.id}`);
  }

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/restaurants/${restaurant._id}`);
  }