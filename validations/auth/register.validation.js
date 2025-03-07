const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().required(),
    name: Joi.string().required(),
    // phone: Joi.string().required(),
    password: Joi.string().required(),
});

module.exports =  registerSchema;