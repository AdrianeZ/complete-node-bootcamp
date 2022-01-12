const express = require("express");
const {
    signUp, logIn, forgotPassword, resetPassword, updatePassword, protect
} = require("../controllers/authController");
const {
    getAllUsers, getUser, addUser, updateUser, deleteUser, updateMe, deleteMe
} = require("../controllers/userController");

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/login", logIn);
router.post("/forgotPassword", forgotPassword);
router.patch("/updatePassword", protect, updatePassword);
router.patch("/resetPassword/:token", resetPassword);

router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

router.route("/").get(getAllUsers).post(addUser)
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
