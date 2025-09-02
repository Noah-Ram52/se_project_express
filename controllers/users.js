const {
  OK_REQUEST,
  CREATED_REQUEST,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errorCodes");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/secretCode");
const jwt = require("jsonwebtoken");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_REQUEST).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

// POST /users

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).send({ message: "All fields are required" });
  }

  User.create({ name, avatar, email, password })
    .then((user) => User.findById(user._id).select("+password"))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(CREATED_REQUEST).send(userObj);
    })
    .catch((err) => {
      return res.status(BAD_REQUEST).send({ message: err.message });
    });
};

const userAuth = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password required" });
  }
  // Replace this with real authentication logic!
  // return res.status(200).send({ token: "dummy-jwt-token" });

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch(() => {
      return res.status(401).send({ message: "Incorrect email or password" });
    });
};

// GET /users/:userId
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK_REQUEST).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: err.message,
        });
        // handle the case where the user is not found
      }
      if (err.name === "CastError") {
        // handle other errors
        return res.status(BAD_REQUEST).send({
          message: "User not found",
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: err.message,
      });
    });
};

module.exports = { getUsers, createUser, getUser, userAuth };
