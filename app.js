const express = require('express');
const app = express();

const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override')
const AppError = require('./utils/AppError');

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));

// mongoose.set('strictQuery', false)
const mongoose = require('mongoose');
const { stringify } = require('querystring');
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017/YelpRestaurant', {
useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connection Open');
})
.catch((e) => {
    console.log(e);
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log("Database connected");
})


// const pokeSchema = new mongoose.Schema({
//     name: String,
//     id: Number,
//     type: String,
//     type2: String,
//     HP: Number,
//     Attack: Number,
//     Defence: Number,
// })

// const Pokemon = mongoose.model('Pokemon', pokeSchema);

// const bulbasaur = new Pokemon({name: 'Bulbasuar', id: 1, type: 'grass', type2: 'poison', HP: 45, Attack: 35, Defence: 55})
// const ivysaur = new Pokemon({name: 'Ivysaur', id: 2, type: 'grass', type2: 'poson', HP: 65, Attack: 45, Defence: 55})
// const venusaur = new Pokemon({name: 'Venusaur', id: 3, type: 'grass', type2: 'poison', HP: 88, Attack: 73, Defence: 100})
// const charmander = new Pokemon({name: 'Charmander', id: 4, type: 'fire', HP: 40, Attack: 34, Defence: 35})
// const charmeleon = new Pokemon({name: 'Charmeleon', id: 5, type: 'fire', HP: 55, Attack: 60, Defence: 45})
// const charizard = new Pokemon({name: 'Charizard', id: 6, type: 'fire', type2: 'flying', HP: 75, Attack: 95, Defence: 70})
// const squirtle = new Pokemon({name: 'Squirtle', id: 7, type: 'water', HP: 40, Attack: 55, Defence: 60})
// const wartortle = new Pokemon({name: 'Wartortle', id: 8, type: 'water', HP: 50, Attack: 55, Defence: 60})
// const blastoise = new Pokemon({name: 'Blastoise', id: 9, type: 'water', HP: 76, Attack: 85, Defence: 95})
// const caterpie = new Pokemon({name: 'Caterpie', id: 10, type: 'bug', HP: 40, Attack: 39, Defence: 34})
// const metapod = new Pokemon({name: 'Metapod', id: 11, type: 'bug', HP: 45, Attack: 40, Defence: 70})
// const movie = mongoose.model("Movies", Schema)

// const Terminator = new movie({
// name: "Terminator",
// location: "In memory",
// id: 002
// })

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
// },
//     price: {
//         type: Number,
//         min: 0,
// },  

//     onSale: {
//         type: Boolean,
//         default: false,   
// },
//     categories: {
//         type: [String],
//         default: ['cycling', 'trailrunning']
// }
// })

// //instance method/all methods should be placed before model
// productSchema.methods.greet = function() {
//     console.log('Hello');
// }

// productSchema.methods.doSomething = function() {
//     console.log(2 + 2);
//     let arr = [];
//     arr.push('Alakasam', 'Charizard', 'Mareep', 'Totodile')
//     console.log(arr)
// }

// productSchema.methods.getPokemon = function() {
//     let pokeArr = [];
//     pokeArr.push('Croconaw', 'Kadabra', 'Beedrill', 'Bulbasaur');
//     console.log(pokeArr)
// }

// productSchema.methods.returnPokemon = function() {
//     let rArr = [];
// rArr.push('Gyrados', 'Tyrannitar', 'Ho-oh', 'Luguia', 'Sandslash');
// console.log('Return!!', rArr)
// }

// productSchema.methods.showPokemon = function() {
//     const pk = [];
//     pk.push('Ivysaur', 'Mareep', 'Croconaw', 'Spinarak', 'Farfetched', 'Gyrados', 'Sunflora', 'Phanpy');
//     pk.pop();
//     pk.splice(2, 0, 'Sunkern', 'Rhydon');
//     console.log(pk)
// }

// productSchema.methods.showSomething = function() {
//     console.log('Hello');
//     let pokemon = ['Mew', 'Mewtwo', 'Moltres', 'Zapdos', 'Articuno']
//     console.log(pokemon);
// }

// productSchema.methods.toggleOnSale = function() {
//     this.onSale = !this.onSale;
//     return this.save();
// }

// productSchema.statics.fireSale = function() {
//     return this.updateMany({}, {onSale: true, price: 0})
// }
// const Product = mongoose.model('Product', productSchema);

// Product.fireSale().then(res => console.log(res))
// // const bike = new Product({name: 'Mountain bike', price: 100, categories: ['biking', 'training']})
// // bike.save()

// //finding a product in the database and calling instance method
// // const findProduct = async () => {
// //     const foundProduct = await Product.findOne({name: 'Mountain bike'})
// //     foundProduct.showSomething();
// // }
// // findProduct();
// let p = new Product({name: "cycling Jersey", price: 50})
// p.save();

// Product.findOneAndUpdate({name: 'Mountain bike'}, {price: 29.99}, {new: true, runValidators: true})
// .then((data) => {
//     console.log(data);
// })
// .catch((e) => {
//     console.log('Error with submission', e)
// })


// const movieSchema = new mongoose.Schema({
//     title: String,
//     year: Number,
//     score: Number,
//     rating: String,
// });

// const Movie = mongoose.model('Movie', movieSchema);

// const amadeus = new Movie({title: 'Amadeus', year: 1986, score: 9.2, rating: 'R'})

// Movie.insertMany([{title: 'Star Wars', year: 1988, score: 8.1, rating: 'PG=13'}, 
// {title: 'Jurassic Park', year: 1993, score: 8.2, rating: 'PG-13'}, 
// {title: 'Terminator', year: 1992, score: 8.4, rating: 'R'}, 
// {title: 'Die Hard', year: 1988, score: 8.0, rating: 'R'}])
// .then((data) => {
//     console.log('It worked')
//     console.log(data)
// })



// // const restaurantSchema = new mongoose.Schema({
// //     name: String,
// //     location: String,
// //     id: Number,

// // })

// //  const Restaurant = mongoose.model('Restaurant', restaurantSchema)
// // new Restaurant({name: 'estaurant', location: 'San diego', id: 003})

// let restaurants = [
//     {
//         id: 1,
//         name: 'Angelos Grill House',
//         // isRestaurant: true
//         comment: 'Very good Restaurant!'
//     },
//     {
//         id: 2,
//         name: 'Daphnes Mediterranian',
//         // isRestaurant: true
//         comment: 'Great food and atmoshere'
//     },
//     {
//         id: 3,
//         name: 'SouthWest Grill and SportsBar',
//         // isRestaurant: false
//         comment: 'awesome quality service'
//     },
//     {
//         id: 4,
//         name: 'Pastrami ClubHouse',
//         // isRestaurant: false
//         comment: 'different flavors and selection'
//     }
// ]


app.get("/error", (req, res) => {
    // res.send("error")
chicken.fly();
})

//use a callback function for specific routes and insert them into route handler
//use instead of generic app.use for every route
const verifyPassword = ((req, res, next) => {
    const {password} = req.query;
    if(password === "chicken") {
    next();
} else {
    // console.log('You need a password!!!')
    // res.send('You need a password!!!');
    throw new AppError('password required', 401)
}
})

app.get('/admin', (req, res) => {
    throw new AppError('Your not an Admin', 403)
})

app.get('/cats', verifyPassword, (req, res) => {
    console.log('MEOW');
    res.send('MEOW');
})

app.get('/dogs', (req, res, next) => {
    const {password} = req.query;
    if(password === 'Woof') {
    next()
} else {
    res.send('need password!!!');
}

})
app.get('/secret', (req, res) => {

    res.send("this is the secret: Hello")
})

app.use((req, res, next) => {
    console.log('Woof Woof');
    res.send('Woof Woof');
})

// app.use((err, req, res, next) => {
// console.log("***********")
// console.log("***ERROR***")
// console.log("***********")
// // res.status(500).send("Oh boy we got an error");
// // console.log(err)
// next(err);
// })

app.use((err, req, res, next) => {
    console.log(err);
    next(err);
})

app.use((err, req, res, next) => {
    const {status = 500} = err;
    const {message} = err;
    res.status(status).send(message)
// res.status(500).send("Oh boy we got an error");
// console.log(err)

})

app.get('/', (req, res) => {
    res.send('HOME')
})

app.get('/restaurants', (req, res) => {
    // res.send('Hello');
res.render('restaurants/index', {restaurants});
})

app.get('/restaurants/new', (req, res) => {
    res.render('restaurants/new')
})

app.post('/restaurants', (req, res) => {
console.log(req.body);
const {name, comment} = req.body;
// res.send('it worked');
restaurants.push({name, comment});
// const {name, comments} = req.body;
// restaurants.push(name, comments);
// res.send('It worked'); 
res.redirect('/restaurants');
})

app.get('/restaurants/:id', (req, res) => {
    const {id} = req.params;
// const id = req.params.id;
   const restId = restaurants.find(c => c.id === parseInt(id))
    res.render('restaurants/show', {restId})
    // console.log(restId);
// res.send('It worked');
})

app.get('/restaurants/:id/edit', (req, res) => {
    const {id} = req.params;
// console.log(id);
// res.send('it worked');
    const comment = restaurants.find(c => c.id === parseInt(id));
// console.log(comment);
    res.render('restaurants/edit', {comment});
})


app.patch('/restaurants/:id', (req, res) => {
    const {id} = req.params;
    // console.log(req.body.comment);
    // res.send('All Good')
const newComment = req.body.comment;
// console.log(newComment);
const foundComment = restaurants.find(c => c.id === parseInt(id));
// console.log(foundComment);
foundComment.comment = newComment;
res.redirect('/restaurants');
// res.send('Updating Something')
})

app.delete('/restaurants/:id', (req, res) => {
    const {id} = req.params;
    // const foundComment = restaurants.find(c => c.id === id)
    restaurants = restaurants.filter(c => c.id !== parseInt(id));
    res.redirect('/restaurants');
})

// app.get('/restaurants/:id/edit', (req, res) => {
//     const {id} = req.params
//     const comment = restaurants.find(c => c.id === id)
//     res.render('restaurants/edit', {comment});
// })

app.listen(3000, () => {
    console.log("listening on port 3000 in Restaurant app!")
})