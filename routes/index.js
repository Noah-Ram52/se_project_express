const router = require("express").Router();
const clothingItem = require("./clothingItem");
const { NOT_FOUND } = require("../utils/errorCodes");
const userRouter = require("./users");

// Route /users to userRouter
router.use("/users", userRouter);

// Route /items to clothingItem router
router.use("/items", clothingItem);

// Catch-all for undefined routes
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
