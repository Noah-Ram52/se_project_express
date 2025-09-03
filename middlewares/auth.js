const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/secretCode");
const { UNAUTHORIZED_ERROR_CODE } = require("../utils/errorCodes");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization Required" });
  }

  req.user = payload;
  next();
};
