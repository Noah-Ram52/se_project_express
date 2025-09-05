const ClothingItem = require("../models/clothingItems");
const {
  OK_REQUEST,
  CREATED_REQUEST,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errorCodes");

const createItem = (req, res) => {
  // Destructure the required fields from the request body
  // This assumes the request body contains these fields
  // and that they are required for creating a clothing item
  // If any of these fields are missing, the request will return a 400 Bad Request

  const { name, weather, imageUrl } = req.body;

  // Validate required fields
  // Note: This validation is done again in the catch block to ensure it catches errors correctly
  if (!name || !weather || !imageUrl) {
    return res.status(BAD_REQUEST).send({
      message: "Name, weather, and imageUrl are required fields",
    });
  }

  // return ClothingItem.create fixed (error  Expected to return a value at the end
  // Of arrow function  consistent-return)

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(CREATED_REQUEST).send(item))
    .catch((e) => {
      console.error("Error creating item:", e.message);
      return res.status(BAD_REQUEST).send({
        message: "Error from createItem",
        error: e.message,
      });
    });
};

// GET request to retrieve all items

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK_REQUEST).send({ items }))
    .catch((e) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: "Error from getItems",
        e,
      });
    });
};

// PUT request to update an item

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(OK_REQUEST).send({ data: item }))
    .catch((e) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: "Error from updateItems",
        e,
      });
    });
};

// Like an item: PUT request

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    // When id = "text" → Mongoose throws a CastError → now caught properly → returns 400.
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(OK_REQUEST).send(item);
    })
    .catch((e) => {
      if (e.name === "CastError" || e.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error liking item", e });
    });
};

// DELETE request to delete an item

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      // Return 200 with the deleted item data as expected by the test
      res.status(OK_REQUEST).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: "Item not found",
        });
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid item ID",
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Error from deleteItem",
        e,
      });
    });
};

// Dislike an item: PUT request

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user } }, // remove _id from likes array
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(OK_REQUEST).send({ data: item });
    })
    .catch((e) => {
      res.status(BAD_REQUEST).send({ message: "Error disliking item", e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
