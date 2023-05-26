const {restaurantSchema} = require('./schemas.js')
const AppError = require('./utils/AppError')
const Restaurant = require('./models/restaurant');
const Review = require('./models/reviews');


module.exports.isLoggedIn = (req, res, next) => {
// console.log('REQ.USER...', req.user)
if(!req.isAuthenticated()) {
//store the url they are requesting
req.session.returnTo = req.originalUrl;
console.log(req.path, req.originalUrl)
    req.flash('error', 'You must be signed in');
    return res.redirect('/login');
}
    next();
}

module.exports.isAuthor = async(req, res, next) => {
const {id} = req.params;
const restaurant = await Restaurant.findById(id);
if (!restaurant.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that')
    return res.redirect(`/restaurants/${id}`);
}
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/restaurants/${id}`);
}
    next();
}

module.exports.validateRestaurant = (req, res, next) => {
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
module.exports.storeReturnTo = (req, res, next) => {
    // const origUrl = req.session.returnTo = req.originalUrl;
if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
}
    // res.redirect(origUrl || '/restaurants');
    next();
}