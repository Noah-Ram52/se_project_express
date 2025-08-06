const {
  OK_REQUEST,
  CREATED_REQUEST,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errorCodes");

const User = require("../models/user");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK_REQUEST).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: err.message,
      });
    });
};

// POST /users

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(CREATED_REQUEST).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: err.message,
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: err.message,
      });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK_REQUEST).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        // return res.status(400).send({
        //   message: err.message,
        return res.status(NOT_FOUND).send({
          message: err.message,
        });
        // handle the case where the user is not found
      } else if (err.name === "CastError") {
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

module.exports = { getUsers, createUser, getUser };
