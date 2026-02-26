const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

const { validateId, validateCardBody } = require("../middlewares/validation");

// CRUD routes for clothing items
// CRUD = Create, Read, Update, Delete

// CREATE
router.post("/", validateCardBody, createItem);

// READ

router.get("/", getItems);

// Protecting the routes that require authentication
router.use(auth);

// UPDATE

router.put("/:id", updateItem); // Assuming updateItem can also handle updates
router.put("/:id/likes", likeItem);

// DELETE

router.delete("/:id", validateId, deleteItem); // Assuming deleteItem can handle deletion by itemId
router.delete("/:id/likes", validateId, dislikeItem);

module.exports = router;
