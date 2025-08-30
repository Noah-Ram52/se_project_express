const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
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

module.exports = mongoose.model("user", userSchema);
