const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Restaurant = require('./models/restaurant');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/AppError')
const ejsMate = require('ejs-mate');
const ObjectId = require('mongoose').Types.ObjectId;
// const Joi = require('joi');
const {restaurantSchema, reviewSchema} = require('./schemas.js');
const Review = require('./models/reviews');
const restaurant = require('./models/restaurant');

app.engine('ejs', ejsMate)
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('__method'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
mongoose.set('strictQuery', false)

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

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error) {
    const msg = error.details.map((el => el.message)).join(',')
    throw new AppError(msg, 404)
} else {
    next();
}
}

mongoose.connect('mongodb://localhost:27017/YelpRestaurant', {
useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'))
db.once('open', () => {
    console.log('Database Connected')
})



///middleware
// app.use((req, res, next) => {
//     res.send('Hello')
//     next()
// })

// app.use((req, res, next) => {
//     console.log('WYD')
// })

// app.use((req, res, next) => {
//     // console.log(req.query)
//     const {password} = req.query;
//     if(password === 'chickennugget') {
//         next()
// } else {
//     console.log('Wrong password')
// }
// })

// app.get('/cats', verifyPassword, (req, res) => {
//     console.log('Meow');
// })

// app.get('/dogs', (req, res) => {
//     console.log('Woof Woof')
// })

// function verifyPassword(req, res, next) {
//     const {password} = req.query;
//     if (password === 'chickennugget') {
//         next();
// } else {
//     console.log('you need a password')
// }
// }


// app.get('/restaurant', (req, res) => {
//     res.send('Home')
// })

// app.get('/makerestaurant', async (req, res) => {
//     const restaurant = new Restaurant({title: "Angelo's", description: "5 star restaurant" });
//     await restaurant.save();
//     res.send(restaurant);
// })

app.get('/restaurants', async (req, res) => {
    // const restaurant = new Restaurant.find({});
    const restaurants = await Restaurant.find();
    res.render('restaurants/index', {restaurants})
});

app.get('/restaurants/new', (req, res) => {
    res.render('restaurants/new');
})

app.post('/restaurants', validateRestaurant, catchAsync(async (req, res, next) => {
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

app.get('/restaurants/:id', catchAsync(async (req, res, next) => {
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

// app.get('/restaurants/:id', async (req, res, next) => {
// try {
//     const {id} = req.params;
//     // const foundId = await Restaurant.find((r) => r.id === id);
// //use this, but still throws cast errors
// // if(!ObjectId.isValid(id)) {
// //     throw new AppError('Invalid Id', 400);
// // }
// //use this, catches all invalid objectId's/cast errors
// const foundId = await Restaurant.findById(req.params.id)
//     // res.render('restaurants/show', {foundId});
//     res.render('restaurants/show', {foundId})
// }catch (e) {
//     next(new AppError('Invalid Id', 404))
// }
// });

app.get('/restaurants/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const restaurant = await Restaurant.findById(id);
    res.render('restaurants/edit', {restaurant});
}));

app.put('/restaurants/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
res.redirect(`/restaurants/${restaurant._id}`)
// res.send('It worked')
}));

app.delete('/restaurants/:id', catchAsync(async (req, res) => {
const {id} = req.params;
await Restaurant.findByIdAndDelete(id);
res.redirect('/restaurants');
}));

//REVIEWS
app.post('/restaurants/:id/reviews', validateReview, async(req, res) => {
    // res.send('You made it');
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    restaurant.review.push(review);
    await review.save();
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
    // const {id} = req.params;
    // const review = req.body.restaurant;
})

app.delete('/restaurants/:id/reviews/:reviewId', catchAsync(async(req, res, next) => {
// console.log("Deleted!!")
    const {id, reviewId} = req.params;
//     if (!ObjectId.isValid(id)) {
//     next(new AppError('Invalid id', 404))
// } else {
    // const {id, reviewId} = req.params;
    await Restaurant.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/restaurants/${id}`);
    // res.send('Delete Me')
// }
}));



app.all('*', (req, res, next) => {
    // res.send('404');
    next(new AppError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    // res.send('Oh boy something went wrong!')
// const {status = 500, message = "Something went wrong"} = err
const {status = 500} = err;
if(!err.message) err.message = 'Oh no, Something went wrong';
// res.status(status).send(message);
res.status(status).render('error', {err})
// res.send('oh boy something went wrong');
})

// app.use((err, req, res, next) => {
//     console.log(err.name);
//     next(err);
// })

// app.use((err, req, res, next) => {
//     const {status = 500} = err;
//     const {message = "Something went wrong"} = err;
//     res.status(status).send(message);
// })
// app.get('/restaurants/new', (req, res) => {
//     res.render('restaurants/new');
// })

// farmSchema.post('findOneAndDelete', async function(data) {
//     if (farm.products.length) {
//         const await Product.deleteMany({_id: {$in: farm.products}})
// }
// })

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
