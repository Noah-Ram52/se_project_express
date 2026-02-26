const ClothingItem = require("../models/clothingItems");
const { OK_REQUEST, CREATED_REQUEST } = require("../utils/errorCodes");

const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");

const createItem = (req, res, next) => {
  // Destructure the required fields from the request body
  // This assumes the request body contains these fields
  // and that they are required for creating a clothing item
  // If any of these fields are missing, the request will return a 400 Bad Request

  const { name, weather, imageUrl } = req.body;

  // Validate required fields
  // Note: This validation is done again in the catch block to ensure it catches errors correctly
  if (!name || !weather || !imageUrl) {
    // return res.status(BAD_REQUEST).send({
    //   message: "Name, weather, and imageUrl are required fields",
    // });
    return next(
      new BadRequestError("Name, weather, and imageUrl are required fields")
    );
  }

  // return ClothingItem.create fixed (error  Expected to return a value at the end
  // Of arrow function  consistent-return)

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(CREATED_REQUEST).send(item))
    .catch((err) => {
      console.error("Error creating item:", err);

      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Invalid data provided for clothing item")
        );
      }

      return next(err);
    });
};

// GET request to retrieve all items

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(OK_REQUEST).send({ items }))
    .catch(next);
};

// PUT request to update an item

const updateItem = (req, res, next) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(
    id,
    { $set: { imageUrl } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => res.status(OK_REQUEST).send({ data: item }))
    .catch((err) => {
      console.error("Error updating item:", err);

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }

      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BadRequestError("Invalid data provided"));
      }

      return next(err);
    });
};

// Like an item: PUT request

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OK_REQUEST).send(item))
    .catch((err) => {
      console.error("Error liking item:", err);

      if (err.name === "CastError" || err.name === "ValidationError") {
        return next(new BadRequestError("Invalid item ID"));
      }

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }

      return next(err);
    });
};

// DELETE request to delete an item
// next is handling the errors

const deleteItem = (req, res, next) => {
  const { id } = req.params;

  ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }

      // Checking ownership
      if (item.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError("You cannot delete someone else's item")
        );
      }

      return ClothingItem.findByIdAndDelete(id).then(() =>
        res.status(OK_REQUEST).send({ message: "Item deleted successfully" })
      );
    })
    .catch((err) => {
      console.error("Error deleting item:", err);

      if (err.name === "CastError") {
        return next(new BadRequestError("Item not found"));
      }

      return next(err);
    });
};

// Dislike an item: PUT request

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // remove _id from likes array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OK_REQUEST).send({ data: item }))
    .catch((err) => {
      console.error("Error disliking item:", err);

      if (err.name === "CastError" || err.name === "ValidationError") {
        return next(new BadRequestError("Invalid item ID"));
      }

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }

      return next(err);
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
