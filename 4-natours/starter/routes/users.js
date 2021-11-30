const express = require("express");
const {signUp} = require("../controllers/authController");
const {getAllUsers,getUser,addUser,updateUser,deleteUser} = require("../controllers/userController");

const router = express.Router();

router.post("/sign-up", signUp )

router.route("/").get(getAllUsers).post(addUser)
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);



module.exports = router;
