const Joi = require('joi');

const addUserSchema = Joi.object({
    email: Joi.string().required(),
    name: Joi.string().required(),
});

module.exports =  addUserSchema;