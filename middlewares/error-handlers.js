module.exports = (err, req, res, next) => {
  // Log the error to console
  console.error(err);

  // If the error has a status code, use it; otherwise default to 500
  const statusCode = err.statusCode || 500;

  // If the error has a message, use it; otherwise use a generic message
  const message = err.message || "An error occurred on the server";

  res.status(statusCode).send({ message });
};
