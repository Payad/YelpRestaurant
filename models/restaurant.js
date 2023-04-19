const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
title: {
    type: String,
    // required: true,
},
description: String,
location: String,
image: {
    type: String,
    // required: true
}

})

module.exports = mongoose.model('Restaurant', RestaurantSchema)