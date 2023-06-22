const Restaurant = require('../models/restaurant');
const AppError = require('../utils/AppError');
const ObjectId = require('mongoose').Types.ObjectId;
const cloudinary = require('cloudinary').v2;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.renderHome = (req, res) => {
    res.render('restaurants/home')
}

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
const geoData = await geocoder.forwardGeocode({
    query: req.body.restaurant.location,
    limit: 1
}).send();
// res.send(geoData.body.features[0].geometry)
const restaurant = new Restaurant(req.body.restaurant);
restaurant.images = req.files.map(f => ({url: f.path, filename: f.filename}))
restaurant.geometry = geoData.body.features[0].geometry;
restaurant.author = req.user._id;
await restaurant.save();
console.log(restaurant);
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
console.log(req.body);
// const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
// const restaurant = await Restaurant.findById(id);
// if (!restaurant.author.equals(req.user._id)) {
//     req.flash('error', 'You do not have permission to do that')
//     return res.redirect(`/restaurants/${id}`);
// }
const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
const imgs = req.files.map((f) => ({url: f.path, filename: f.filename}));
restaurant.images.push(...imgs);
await restaurant.save();
if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename)
}
await restaurant.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
}
// await restaurant.updateOne({$pull: {images: {filename: {$in: {deleteImages}}}}})
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