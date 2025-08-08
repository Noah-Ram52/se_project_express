// Create a file named errorCodes.js in the utils directory
// This file will contain the error codes used in the application
// The error codes are exported as constants for use in controllers and routes
// This helps maintain consistency and makes it easier to manage error responses
// The error codes are based on standard HTTP status codes

const OK_REQUEST = 200;
const CREATED_REQUEST = 201;
const NO_CONTENT_REQUEST = 204;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

module.exports = {
  OK_REQUEST,
  CREATED_REQUEST,
  NO_CONTENT_REQUEST,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
};
