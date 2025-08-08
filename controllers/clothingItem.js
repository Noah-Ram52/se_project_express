const ClothingItem = require("../models/clothingItems");
const {
  OK_REQUEST,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errorCodes");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body; // ✅ Use imageUrl (lowercase L)

  ClothingItem.create({ name, weather, imageURL }) // ✅ Match key casing in DB
    .then((item) => {
      console.log(item);
      res.status(201).send(item); // ✅ Send item directly, not wrapped in { data: item }
    })
    .catch((e) => {
      console.error("Error creating item:", e.message);
      res.status(OK_REQUEST).send({
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
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
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

  console.log("Deleting item with ID:", itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res
        .status(NO_CONTENT_REQUEST)
        .send({ data: item })
        .catch((e) => {
          res.status(INTERNAL_SERVER_ERROR).send({
            message: "Error from updateItems",
            e,
          });
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
