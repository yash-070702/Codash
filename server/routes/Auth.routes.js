const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendotp,
  logout,

} = require("../Controllers/Auth.Controller");

const { auth } = require("../middlewares/Auth.middleware");

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp);

router.post("/logout", logout);

module.exports = router;