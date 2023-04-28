const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')

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
},

review: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
]

});
//mongoose middleware
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