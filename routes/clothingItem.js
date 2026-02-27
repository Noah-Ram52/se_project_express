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

router.get("/", getItems);

// Protecting the routes that require authentication
// Apply authentication middleware to all routes below this line
router.use(auth);

router.post("/", validateCardBody, createItem);

router.put("/:id", updateItem);
router.put("/:id/likes", validateId, likeItem);

router.delete("/:id", validateId, deleteItem); // Assuming deleteItem can handle deletion by itemId
router.delete("/:id/likes", validateId, dislikeItem);

module.exports = router;
