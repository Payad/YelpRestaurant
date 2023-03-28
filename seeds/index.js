const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant')
const cities = require('./cities')
const {descriptors, types} = require('./seedHelpers');



mongoose.connect('mongodb://localhost:27017/YelpRestaurant', {
useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'))
db.once('open', () => {
    console.log('Database Connected')
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Restaurant.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const restaurant = new Restaurant({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(types)}`
})
    await restaurant.save();
        // const cities = cities[random1000].city;
}
    // const r = new Restaurant({title: "Crazy Colors", Description: "Different Colors"})
    // await r.save();
}

seedDB().then(() => {
    mongoose.connection.close();
});