const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");
// Routes to users
// The "/" is already equivelent to "/users" which is why it is "/"
// Uses requests: It uses the GET and the POST requests.

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

// Exporting the const router
module.exports = router;
