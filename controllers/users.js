const jwt = require("jsonwebtoken");
const { OK_REQUEST, CREATED_REQUEST } = require("../utils/errorCodes");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../errors");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/secretCode");

// GET /users

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(OK_REQUEST).send(users))
//     .catch((err) => {
//       console.error(err);
//       return res.status(INTERNAL_SERVER_ERROR).send({
//         message: "An error has occurred on the server",
//       });
//     });
// };

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK_REQUEST).send(users))
    .catch(next); // forward unexpected errors to error middleware
};

// POST /users (signup)

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    // return res.status(BAD_REQUEST).send({ message: "All fields are required" });
    return next(new BadRequestError("All fields are required"));
  }

  return User.create({ name, avatar, email, password })
    .then((user) => User.findById(user._id).select("+password"))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(CREATED_REQUEST).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        // Duplicate key error (email already exists)
        // Duplicate key -> conflict
        // return res
        //   .status(CONFLICT_ERROR_CODE)
        //   .send({ message: "A user with this email already exists" });
        return next(new ConflictError("A user with this email already exists"));
      }
      // Mongoose validation -> bad request
      if (err.name === "ValidationError") {
        // return res.status(BAD_REQUEST).send({ message: err.message });
        return next(new BadRequestError(err.message));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server" });
      // Unexpected -> forward
      return next(err);
    });
};

// TODO: Fix existing users with status 409 error instead of 201

// POST /signin
const userAuth = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // return res
    //   .status(BAD_REQUEST)
    //   .send({ message: "Email and password required" });
    return next(new BadRequestError("Email and password required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch(() =>
      // res
      //   .status(UNAUTHORIZED_ERROR_CODE)
      //   .send({ message: "Incorrect email or password" })
      next(new UnauthorizedError("Incorrect email or password"))
    );
};

// GET /users/:userId
// const getUser = (req, res, next) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(OK_REQUEST).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({
//           message: err.message,
//         });
//         // handle the case where the user is not found
//       }
//       if (err.name === "CastError") {
//         // handle other errors
//         return res.status(BAD_REQUEST).send({
//           message: "User not found",
//         });
//       }
//       return res.status(INTERNAL_SERVER_ERROR).send({
//         message: "An error has occurred on the server",
//       });
//     });
// };

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK_REQUEST).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("User not found"));
      }
      return next(err);
    });
};

// GET /users/me

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(OK_REQUEST).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      return next(err);
    });
};

// PATCH /users/me

// const updateUserProfile = (req, res) => {
//   const { name, avatar } = req.body;

//   User.findByIdAndUpdate(
//     req.user._id,
//     { name, avatar },
//     { new: true, runValidators: true }
//   )
//     .orFail()
//     .then((user) => res.status(OK_REQUEST).send(user))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         return res.status(BAD_REQUEST).send({ message: err.message });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({ message: "User not found" });
//       }
//       return res
//         .status(INTERNAL_SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

const updateUserProfile = (req, res, next) => {
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
        return next(new BadRequestError(err.message));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      return next(err);
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
