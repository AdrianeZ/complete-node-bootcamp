const express = require("express");
const {signUp, logIn} = require("../controllers/authController");
const {getAllUsers, getUser, addUser, updateUser, deleteUser} = require("../controllers/userController");

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/login", logIn);

router.route("/").get(getAllUsers).post(addUser)
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
