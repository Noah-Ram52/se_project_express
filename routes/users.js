const router = require("express").Router();
const { getUsers } = require("../controllers/users");
// Routes to users
// The "/" is already equivelent to "/users" which is why it is "/"
// Uses requests: It uses the GET and the POST requests.

router.get("/", getUsers);
router.get("/:userId", () => console.log("GET users"));
router.post("/", () => console.log("POST users"));

// Exporting the const router
module.exports = router;
