const Joi = require('joi');

const updateSchema = Joi.object({
    business_name: Joi.string().required(),
    business_email: Joi.string().email().optional(),
    business_phone: Joi.string().optional(),
    business_website: Joi.string().uri().optional(),
    business_id: Joi.number().required(),
  });
  
  module.exports =  updateSchema;