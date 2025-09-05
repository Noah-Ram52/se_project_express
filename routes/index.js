const router = require("express").Router();
const clothingItem = require("./clothingItem");
const { NOT_FOUND } = require("../utils/errorCodes");
const userRouter = require("./users");
const { createUser, userAuth } = require("../controllers/users");

// Note: Ensure that the order of routes is correct to avoid conflicts
// for example, /signup should be defined before /users
// if they share a common prefix

// Public signup route
router.post("/signup", createUser);

// Public signin route
router.post("/signin", userAuth);

// Route /users to userRouter (protected routes)
router.use("/users", userRouter);

// Route /items to clothingItem router
router.use("/items", clothingItem);

// Catch-all for undefined routes
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
