const ClothingItem = require("../models/clothingItems");
const {
  OK_REQUEST,
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

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.status(201).send(item);
    })
    .catch((e) => {
      console.error("Error creating item:", e.message);
      res.status(BAD_REQUEST).send({
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
    req.params.itemId,
    { $addToSet: { likes: req.user?._id || req.body.userId } }, // fallback for testing
    { new: true }
  )
    .then((item) => {
      if (!item) {
        // Item not found, return 404
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      // Success: return 200
      return res.status(OK_REQUEST).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "CastError" || e.name === "ValidationError") {
        // Invalid ID: return 400
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      // Other errors: return 500
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

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from likes array
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      res.status(OK_REQUEST).send({ data: item });
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
  likeItem, // <-- add this
  dislikeItem, // <-- and this
};
