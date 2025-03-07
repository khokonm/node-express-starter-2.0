const Joi = require('joi');

const addDepartmentSchema = Joi.object({
    department_name: Joi.string().required(),
    department_color: Joi.string().required(),
});

module.exports =  addDepartmentSchema;