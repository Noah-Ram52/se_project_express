const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Routes to users

// The "/" is already equivelent to "/users" which is why it is "/"
// Uses requests: It uses the GET and the POST requests.

// Protected user routes
// Note: "/me" routes work with the currently authenticated user
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserProfile);

// Exporting the const router
module.exports = router;
