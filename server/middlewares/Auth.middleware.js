const jwt = require("jsonwebtoken");
const nano = require("nano")(process.env.COUCHDB_URL);
const UserDB = nano.db.use("codash"); // Use your actual DB name
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    // Extract JWT token from cookies, body, or header
    const token =
      req.cookies.token ||
      req.body.token ||
      (req.header("Authorization") &&
        req.header("Authorization").replace("Bearer ", "").trim());

    // If JWT is missing, return response
    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      // Verifying the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      // Fetch user from CouchDB using decoded ID
      const user = await UserDB.get(decoded.id);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      user.id = user._id; //
      delete user.password;
      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};
