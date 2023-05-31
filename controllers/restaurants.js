const Restaurant = require('../models/restaurant');
const AppError = require('../utils/AppError');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.restaurantIndex = async (req, res) => {
    // const restaurant = new Restaurant.find({});
    const restaurants = await Restaurant.find();
    res.render('restaurants/index', {restaurants})
}

module.exports.renderNew = (req, res) => {
//     if(!req.isAuthenticated()) {
//     req.flash('error', 'You must be Logged in');
//     return res.redirect('/login');
// }
    res.render('restaurants/new');
}

module.exports.createNew = async (req, res, next) => {
// try {

//can write own error handler but use joi validation instead
// if(!req.body.restaurant.title) {
//     next(new AppError('invalid restaurant title data', 404))
// }
const restaurant = new Restaurant(req.body.restaurant);
restaurant.author = req.user._id;
await restaurant.save();
req.flash('success', 'Successfully made a new restaurant')
// res.redirect(`restaurants/${restaurant._id}`)
res.redirect(`/restaurants/${restaurant._id}`)
// }
// } catch (e) {
//     next(e)
// }
// res.send(req.body)
}

module.exports.renderShow = async (req, res, next) => {
const {id} = req.params;
// if (foundId) {
const foundId = await Restaurant.findById(req.params.id).populate({
//using nesting to populate owner of review
path: 'review',
populate: {
    path: 'author'
}}).populate('author');
    // res.render('restaurants/show', {foundId});
console.log(foundId);
if (!foundId) {
req.flash('error', 'Cannot find restaurant');
return res.redirect('/restaurants');
}
    res.render('restaurants/show', {foundId})
// } else {
if (!ObjectId.isValid(id)) {
    next(new AppError('Invalid Id', 404))
}
}

module.exports.renderEdit = async (req, res) => {
    const {id} = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
    req.flash('error', 'Cannot find restaurant');
    return res.redirect('/restaurants');
    }
    res.render('restaurants/edit', {restaurant});
}

module.exports.renderUpdate = async (req, res) => {
    const {id} = req.params;
// const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
// const restaurant = await Restaurant.findById(id);
// if (!restaurant.author.equals(req.user._id)) {
//     req.flash('error', 'You do not have permission to do that')
//     return res.redirect(`/restaurants/${id}`);
// }
const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
req.flash('success', 'Successfully updated restaurant')
res.redirect(`/restaurants/${restaurant._id}`)
// res.send('It worked')
}

module.exports.deleteRestaurant = async (req, res) => {
const {id} = req.params;
await Restaurant.findByIdAndDelete(id);
req.flash('success', 'successfully deleted restaurant');
res.redirect('/restaurants');
}