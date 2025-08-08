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
      // Validator uses arrow function to access 'value'
      // This way validator can access isURL method
      validator: (value) => validator.isURL(value),
      message: "Link is not valid",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Set default for likes array
clothingItem.path("likes").default([]);

module.exports = mongoose.model("clothingItems", clothingItem);
