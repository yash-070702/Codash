const express = require("express");
const router = express.Router();

const {
  getCodeChefDetails,
  getLeetCodeDetails,
  getGfgDetails,
  getCodeforcesDetails,
  getHackerRankDetails,
} = require("../Controllers/Platform.Controller");

const { auth } = require("../middlewares/Auth.middleware");

router.get("/getCodeChefDetails/:username", getCodeChefDetails);
router.get("/getLeetCodeDetails/:username", getLeetCodeDetails);
router.get("/getGfgDetails/:username", getGfgDetails);
router.get("/getCodeforcesDetails/:username", auth, getCodeforcesDetails);
router.get("/getHackerRankDetails/:username", auth, getHackerRankDetails);

module.exports = router;
