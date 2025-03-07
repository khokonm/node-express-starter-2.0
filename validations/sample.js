const Joi = require('joi');

const createBusinessSchema = Joi.object({
    business_name: Joi.string().min(3).required().messages({
            'string.base': 'Business name must be a string',
            'string.empty': 'Business name is required',
            'string.min': 'Business name must be at least 3 characters',
            'any.required': 'Business name is required',
    }),
    business_email: Joi.string().email().optional(),
    business_phone: Joi.string().optional(),
    business_website: Joi.string().uri().optional(),
    sample_input: 
        Joi.string()
        .ref('password')
        .number()
        .min(10)
        .max(100)
  });
  
  module.exports =  createBusinessSchema;