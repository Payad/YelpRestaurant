const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Restaurant = require('./models/restaurant')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('__method'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
mongoose.set('strictQuery', false)



mongoose.connect('mongodb://localhost:27017/YelpRestaurant', {
useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'))
db.once('open', () => {
    console.log('Database Connected')
})


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

app.post('/restaurants', async (req, res) => {
const restaurant = new Restaurant(req.body.restaurant);
await restaurant.save();
res.redirect(`restaurants/${restaurant._id}`)
// res.send(req.body)
})


app.get('/restaurants/:id', async (req, res) => {
    const {id} = req.params;
    // const foundId = await Restaurant.find((r) => r.id === id);
const foundId = await Restaurant.findById(req.params.id)
    // res.render('restaurants/show', {foundId});
    res.render('restaurants/show', {foundId})
});

app.get('/restaurants/:id/edit', async (req, res) => {
    const {id} = req.params;
    const restaurant = await Restaurant.findById(id);
    res.render('restaurants/edit', {restaurant});
});

app.put('/restaurants/:id', async (req, res) => {
    const {id} = req.params;
const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
res.redirect(`/restaurants/${restaurant._id}`)
// res.send('It worked')
})

app.delete('/restaurants/:id', async (req, res) => {
const {id} = req.params;
await Restaurant.findByIdAndDelete(id);
res.redirect('/restaurants');
})

// app.get('/restaurants/new', (req, res) => {
//     res.render('restaurants/new');
// })

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
