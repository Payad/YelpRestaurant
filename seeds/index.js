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
        //YOUR USER/AUTHOR ID
        author: '646be210d902a266de04c210',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(types)}`,
        geometry: { type: 'Point', 
        // coordinates: [ -117.162773, 32.71742 ]
         coordinates: [cities[random1000].longitude, cities[random1000].latitude]
        },
        // image: 'https://unsplash.com/collections/2468201/restaurants%2Fcafes',
        // image: 'https://source.unsplash.com/collections/2468201',
        // image: 'https://source.unsplash.com/collection/1343727',
        // image: 'https://source.unsplash.com/collection/1343727',
        // image: 'https://unsplash.com/collections/279876/restaurants',
        images: [{
      url: 'https://res.cloudinary.com/dnuxxq2ad/image/upload/v1685724427/YelpRestaurant/omkqynpb11klwjuibxvs.jpg',
      filename: 'YelpRestaurant/omkqynpb11klwjuibxvs',
    //   _id: new ObjectId("647a1d13ed95900c4332115c")
    },
    {
      url: 'https://res.cloudinary.com/dnuxxq2ad/image/upload/v1685724427/YelpRestaurant/oden7fx0k0mvd6vhgsxu.jpg',
      filename: 'YelpRestaurant/oden7fx0k0mvd6vhgsxu',
    //   _id: new ObjectId("647a1d13ed95900c4332115d")
    }
        ],
    // image: 'https://source.unsplash.com/collection/2455617',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non laoreet ante, sit amet malesuada ipsum. Maecenas eget venenatis orci, non posuere metus.'
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