const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "Name must be at least two characters long"],
    maxlength: [30, "Name must be at least two characters long"],
  },
  weather: {
    type: String,
    required: [true, 'The "weather" field must be filled in'],
    emum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Link is not valid",
    },
  },
});

module.exports = mongoose.model("clothingItems", clothingItem);
