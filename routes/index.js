const router = require("express").Router();
const clothingItem = require("./clothingItem");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(INTERNAL_SERVER_ERROR).send({ message: "Router Not Found" });
});

module.exports = router;
