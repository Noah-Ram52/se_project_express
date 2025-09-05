const {
  OK_REQUEST,
  CREATED_REQUEST,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
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

// POST /users or /signup

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
      if (err.code === 11000) {
        // Duplicate key error (email already exists)
        return res
          .status(CONFLICT_ERROR_CODE)
          .send({ message: "A user with this email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// TODO: Fix existing users with status 409 error instead of 201

// POST /signin
const userAuth = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password required" });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch(() => {
      return res
        .status(UNAUTHORIZED_ERROR_CODE)
        .send({ message: "Incorrect email or password" });
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

// GET /users/me

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(OK_REQUEST).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// PATCH /users/me

const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(OK_REQUEST).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  userAuth,
  getCurrentUser,
  updateUserProfile,
};
