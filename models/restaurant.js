const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')



// imageSchema.virtual('thumbnail').get(function() {
//     this.url.replace('/upload', '/upload/w_200')
// })

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = {toJSON: {virtuals: true}}

const RestaurantSchema = new Schema({
title: {
    type: String,
    // required: true,
},
description: String,
location: String,
images: [ImageSchema],
geometry: {
    type: {
        type: String,
        enum: ['Point'],
        required: true
},
coordinates: {
    type: [Number],
    required: true
}
},
// images: [{
   
//     url: String,
//     filename: String
//     // required: true
// }],
// images: [
//     {

// }
// ]

review: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
], 
author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
}

}, opts);


RestaurantSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/restaurants/${this._id}">${this.title}</a></strong>
            <p>${this.description.substring(0, 20)}...</p>`
})
//mongoose middleware
//to delete reviews from mongodb when campground is deleted 
//(removing review and object id of review)


RestaurantSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
    await Review.deleteMany({
        _id: {
                $in: doc.review
}
})
}
})

module.exports = mongoose.model('Restaurant', RestaurantSchema)