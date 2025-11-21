const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const BadRequestError = require("../errors/bad-request-error");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: [true, "Avatar Field is required"],
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Enter valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "Email Field is required"],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Enter valid Email",
    },
  },
  password: {
    type: String,
    required: [true, "Password Field is required"],
    select: false,
  },
});

userSchema.pre("save", async function hashPassword(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new BadRequestError("Incorrect email or password")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new BadRequestError("Incorrect email or password")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
