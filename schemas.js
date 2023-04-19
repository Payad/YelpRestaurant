const Joi = require('joi');

module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
            title: Joi.string().required(),
            location: Joi.string().required(),
            image: Joi.string().required(),
            description: Joi.string().required()
}).required()
})
