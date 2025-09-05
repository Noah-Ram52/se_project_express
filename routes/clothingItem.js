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

// CRUD routes for clothing items
// CRUD = Create, Read, Update, Delete

// CREATE
router.post("/", auth, createItem);

// READ

router.get("/", getItems);

// UPDATE

router.put("/:itemId", auth, updateItem); // Assuming updateItem can also handle updates
router.put("/items/:id/likes", auth, likeItem);
router.put("/:id/likes", auth, likeItem);

// DELETE

router.delete("/:itemId", auth, deleteItem); // Assuming deleteItem can handle deletion by itemId
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
