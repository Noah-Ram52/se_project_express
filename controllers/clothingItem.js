const ClothingItem = require("../models/clothingItems");
const {
  OK_REQUEST,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errorCodes");

const createItem = (req, res) => {
  console.log(req);
  console.log(res);

  const { name, weather, imageURL } = req.body;

  // On Postman, this is POST request with body. it is called "[-] [POST] Add an item with "name" field less than 2 characters"
  // Passing object to create method
  ClothingItem.create({ name, weather, imageURL: imageURL })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(BAD_REQUEST).send({
        message: "Error from createItem",
        e,
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
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      res.status(OK_REQUEST).send({ data: item });
    })
    // Status code should be 200 or 201 | AssertionError: expected 500 to be one of [ 200, 201 ]
    .catch((e) => {
      res.status(BAD_REQUEST).send({ message: "Error liking item", e });
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
