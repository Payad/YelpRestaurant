// if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
// }


const express = require('express');
const app = express();
// const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const Restaurant = require('./models/restaurant');
// const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/AppError')
const ejsMate = require('ejs-mate');
// const ObjectId = require('mongoose').Types.ObjectId;
// const Joi = require('joi');
// const {restaurantSchema, reviewSchema} = require('./schemas.js');
// const Review = require('./models/reviews');
// const Restaurant = require('./models/restaurant');
// const router = require('./routes/routerRests');
const routerReviews = require('./routes/routerReviews');
const routerRests = require('./routes/routerRests');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/users');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// app.use('/', router);
// app.use('/restaurants/:id/reviews', router)

app.engine('ejs', ejsMate)
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('__method'));
app.use(express.static('public'))
app.use(mongoSanitize({replaceWith: '_'}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use(session(sessionConfig))
mongoose.set('strictQuery', false)

// //NOTE: this middleware must come after express.urlencoded to parse body correctly
// app.use('/', routerReviews);
// app.use('/', routerRests);

const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
}

}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({contentSecurityPolicy: false}));


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://code.jquery.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];

const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/"
];

const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dnuxxq2ad/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
},
})
);


//use passport session after session/passport.session requires 
//session to function properly
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

//Serialize/Deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Note: use flash locals before any route handlers or result in res.locals.messages undefined
app.use((req, res, next) => {
    // console.log(req.session)
    console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.messages = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
//NOTE: this middleware must come after express.urlencoded to parse body correctly
app.use('/', routerReviews);
app.use('/', routerRests);
app.use('/', userRoutes)

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

// const validateReview = (req, res, next) => {
//     const {error} = reviewSchema.validate(req.body)
//     if(error) {
//     const msg = error.details.map((el => el.message)).join(',')
//     throw new AppError(msg, 404)
// } else {
//     next();
// }
// }

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

//LINE START
// app.get('/restaurants', async (req, res) => {
//     // const restaurant = new Restaurant.find({});
//     const restaurants = await Restaurant.find();
//     res.render('restaurants/index', {restaurants})
// });

// app.get('/restaurants/new', (req, res) => {
//     res.render('restaurants/new');
// })

// app.post('/restaurants', validateRestaurant, catchAsync(async (req, res, next) => {
// // try {

// //can write own error handler but use joi validation instead
// // if(!req.body.restaurant.title) {
// //     next(new AppError('invalid restaurant title data', 404))
// // }
// const restaurant = new Restaurant(req.body.restaurant);
// await restaurant.save();
// res.redirect(`restaurants/${restaurant._id}`)
// // }
// // } catch (e) {
// //     next(e)
// // }
// // res.send(req.body)
// }));

// app.get('/restaurants/:id', catchAsync(async (req, res, next) => {
// const {id} = req.params;
// // if (foundId) {
// const foundId = await Restaurant.findById(req.params.id).populate('review');
//     // res.render('restaurants/show', {foundId});
// // console.log(foundId);
//     res.render('restaurants/show', {foundId})
// // } else {
// if (!ObjectId.isValid(id)) {
//     next(new AppError('Invalid Id', 404))
// }
// }));
// //LINE END

// // app.get('/restaurants/:id', async (req, res, next) => {
// // try {
// //     const {id} = req.params;
// //     // const foundId = await Restaurant.find((r) => r.id === id);
// // //use this, but still throws cast errors
// // // if(!ObjectId.isValid(id)) {
// // //     throw new AppError('Invalid Id', 400);
// // // }
// // //use this, catches all invalid objectId's/cast errors
// // const foundId = await Restaurant.findById(req.params.id)
// //     // res.render('restaurants/show', {foundId});
// //     res.render('restaurants/show', {foundId})
// // }catch (e) {
// //     next(new AppError('Invalid Id', 404))
// // }
// // });

// //START LINE
// app.get('/restaurants/:id/edit', catchAsync(async (req, res) => {
//     const {id} = req.params;
//     const restaurant = await Restaurant.findById(id);
//     res.render('restaurants/edit', {restaurant});
// }));

// app.put('/restaurants/:id', catchAsync(async (req, res) => {
//     const {id} = req.params;
// const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
// res.redirect(`/restaurants/${restaurant._id}`)
// // res.send('It worked')
// }));

// app.delete('/restaurants/:id', catchAsync(async (req, res) => {
// const {id} = req.params;
// await Restaurant.findByIdAndDelete(id);
// res.redirect('/restaurants');
// }));

// //REVIEWS
// app.post('/restaurants/:id/reviews', validateReview, async(req, res) => {
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

// app.delete('/restaurants/:id/reviews/:reviewId', catchAsync(async(req, res, next) => {
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

app.get('/', (req, res) => {
    res.render('home');
})

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
//END LINE

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
