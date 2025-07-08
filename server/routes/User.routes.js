const express = require("express");
const router = express.Router();

const {
 updateUserDetails,
 changePassword ,
 deleteAccount
} = require("../Controllers/User.Controller");

const { auth } = require("../middlewares/Auth.middleware");

router.put("/updateUserDetails", auth, updateUserDetails );
router.put("/changePassword", auth, changePassword);
router.delete("/deleteAccount", auth, deleteAccount);

module.exports = router;