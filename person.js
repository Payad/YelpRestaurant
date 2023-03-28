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

///MONGOOSE VIRTUALS
const personSchema = new mongoose.Schema({
first: String,
last: String 
})

personSchema.virtual('fullName').get(function () {
return `${this.first} ${this.last}`})

///MONGOOSE MIDDLEWARE
personSchema.pre('save', async function () {
    console.log('ABOUT TO SAVE')
})

personSchema.post('save', async function () {
    console.log('JUST SAVED')
})

const Person = mongoose.model('Person', personSchema)