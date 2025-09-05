const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

// Routes to users

// The "/" is already equivelent to "/users" which is why it is "/"
// Uses requests: It uses the GET and the POST requests.

// Public routes
router.post("/", createUser);

// Protected routes
router.get("/me", auth, getCurrentUser);
router.get("/", auth, getUsers);
router.get("/:userId", auth, getUser);
router.patch("/me", auth, updateUserProfile);

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

// Exporting the const router
module.exports = router;
