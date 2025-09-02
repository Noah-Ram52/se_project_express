const router = require("express").Router();
const clothingItem = require("./clothingItem");
const { NOT_FOUND, OK_REQUEST } = require("../utils/errorCodes");
const userRouter = require("./users");
const { userAuth } = require("../controllers/users");

// Note: Ensure that the order of routes is correct to avoid conflicts
// for example, /signup should be defined before /users
// if they share a common prefix

// Route /users to userRouter
router.use("/users", userRouter);

// Route /items to clothingItem router
router.use("/items", clothingItem);

// Route /signup to userRouter
// Goes through /signup first
router.use("/signup", userRouter);

router.post("/signin", userAuth);

// Catch-all for undefined routes
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
