const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Common Joi Error Types:

// For strings:
// - "string.empty" - When a required field is left completely empty
// - "string.min" - When text is shorter than the minimum length
// - "string.max" - When text is longer than the maximum length
// - "string.email" - When email format is invalid
// - "string.uri" - When URL format is invalid

// URL validation function:

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// Clothing item body validation:

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

// User info body validation:
const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// Validation for authentication User Login:

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required().messages({
      "string.length": "ID must be exactly 24 characters long",
      "string.hex": "ID must be a valid hexadecimal value",
      "string.empty": "ID is required",
    }),
  }),
});

module.exports = {
  validateCardBody,
  validateUserBody,
  validateLogin,
  validateId,
};
