const router = require("express").Router();
const clothingItem = require("./clothingItem");
const { NotFoundError } = require("../errors/not-found-error");
const userRouter = require("./users");
const { createUser, userAuth } = require("../controllers/users");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");

// Note: Ensure that the order of routes is correct to avoid conflicts
// for example, /signup should be defined before /users
// if they share a common prefix

// Public signup route
router.post("/signup", validateUserBody, createUser);

// Public signin route
router.post("/signin", validateLogin, userAuth);

// Route /users to userRouter (protected routes)
router.use("/users", userRouter);

// Route /items to clothingItem router
router.use("/items", clothingItem);

// Catch-all for undefined routes
router.use((req, res, next) =>
  next(new NotFoundError("Requested resource not found"))
);

module.exports = router;
