const Joi = require('joi');

const addMemberSchema = Joi.object({
    member_id: Joi.number().integer().required(),
    business_id: Joi.number().integer().required(),
    business_role: Joi.string().valid('admin', 'manager', 'member').required(),
    department_id: Joi.number().integer().required(),
});

module.exports =  addMemberSchema;