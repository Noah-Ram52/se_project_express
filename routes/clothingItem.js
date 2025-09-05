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
router.post("/", createItem);

// READ

router.get("/", getItems);

// UPDATE

router.put("/:itemId", updateItem); // Assuming updateItem can also handle updates
router.put("/items/:id/likes", likeItem);
router.put("/:id/likes", auth, likeItem);

// DELETE

router.delete("/:itemId", deleteItem); // Assuming deleteItem can handle deletion by itemId
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
