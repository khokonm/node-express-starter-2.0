const sendResponse = require('@utils/responseHandler.util');

const validate = (schema, fields, res) => {
  const { error } = schema.validate(fields, { abortEarly: false });

  if (error) {
    // If validation fails, return a 400 response with the error messages
    sendResponse(res, 400, 'Validation Error', error.details.map((e) => e.message));
    return true; // Signal that there was a validation error
  }

  return false; // No validation error
};

module.exports = validate;
