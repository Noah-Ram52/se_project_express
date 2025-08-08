const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItem");

// CRUD routes for clothing items

// CREATE
router.post("/", createItem);

// READ

router.get("/", getItems);

// UPDATE

router.put("/:itemId", updateItem); // Assuming updateItem can also handle updates

// DELETE

router.delete("/:itemId", deleteItem); // Assuming deleteItem can handle deletion by itemId

module.exports = router;
