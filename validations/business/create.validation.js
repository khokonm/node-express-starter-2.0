const Joi = require('joi');

// const createBusinessSchema = Joi.object({
//   business_name: Joi.string().min(3).required().messages({
//     'string.base': 'Business name must be a string',
//     'string.empty': 'Business name is required',
//     'string.min': 'Business name must be at least 3 characters',
//     'any.required': 'Business name is required',
//   }),
//   business_email: Joi.string().email().required().messages({
//     'string.email': 'Must be a valid email',
//     'any.required': 'Business email is required',
//   }),
//   business_phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
//     'string.pattern.base': 'Business phone must be a valid international phone number',
//     'any.required': 'Business phone is required',
//   }),
//   business_website: Joi.string().uri().optional().messages({
//     'string.uri': 'Business website must be a valid URL',
//   }),
// });

const createSchema = Joi.object({
  business_name: Joi.string().required(),
  business_email: Joi.string().email().optional(),
  business_phone: Joi.string().optional(),
  business_website: Joi.string().uri().optional(),
  business_size: Joi.string().optional(),
  business_type: Joi.string().optional(),
  business_description: Joi.string().optional(),
  short_address: Joi.string().optional(),
});

module.exports =  createSchema;
