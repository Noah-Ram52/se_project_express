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
    .catch((err) => {
      console.error("Error creating item:", err);

      if (err.name === "ValidationError") {
        // ✅ Known/expected error (client’s fault)
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for clothing item" });
      }

      // ✅ Default / unexpected error (server’s fault)
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// GET request to retrieve all items

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK_REQUEST).send({ items }))
    .catch((err) => {
      console.error("Error fetching items:", err);

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// PUT request to update an item

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(OK_REQUEST).send({ data: item }))
    .catch((err) => {
      console.error("Error updating item:", err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
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
    .catch((err) => {
      console.error("Error liking item:", err);

      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
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
    .catch((err) => {
      console.error("Error deleting item:", err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: "Item not found",
        });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid item ID",
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
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
    .catch((err) => {
      console.error("Error disliking item:", err);

      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
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
