const nano = require("nano");
const couch = nano(process.env.COUCHDB_URL);
const userDB = couch.db.use("codash");
const bcrypt = require("bcryptjs");
const mailSender = require("../utils/mailSender");
const passwordUpdated = require("../mail/templates/passwordUpdate");
exports.updateUserDetails = async (req, res) => {
  try {
    console.log("🔧 Updating user details...");

    const {
      _id,
      _rev,
      fullName,
      hackerRankURL,
      leetCodeURL,
      codeChefURL,
      gfgURL,
      codeforcesURL,
      about // Added this field that was missing
    } = req.body;

    if (!_id || !_rev) {
      return res.status(400).json({
        success: false,
        message: "_id and _rev are required to update profile.",
      });
    }

    // Fetch current document
    let userDoc;
    try {
      userDoc = await userDB.get(_id);
      

      
      // ✅ REV CONFLICT CHECK
      if (userDoc._rev !== _rev) {
        return res.status(409).json({
          success: false,
          message: "Document has been modified. Please refresh and try again.",
          currentRev: userDoc._rev
        });
      }
      
    } catch (err) {
      console.error("❌ Error fetching user document:", err);
      if (err.statusCode === 404) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
      return res.status(500).json({ success: false, message: "Failed to retrieve user." });
    }

    // Update fields with validation
    if (fullName) userDoc.fullName = fullName.trim();
    if (about) userDoc.about = about.trim();
    if (hackerRankURL !== undefined) userDoc.hackerRankURL = hackerRankURL.trim();
    if (leetCodeURL !== undefined) userDoc.leetCodeURL = leetCodeURL.trim();
    if (codeChefURL !== undefined) userDoc.codeChefURL = codeChefURL.trim();
    if (gfgURL !== undefined) userDoc.gfgURL = gfgURL.trim();
    if (codeforcesURL !== undefined) userDoc.codeforcesURL = codeforcesURL.trim();

    userDoc.updatedAt = new Date().toISOString();

    // ✅ FIXED: Use the _rev from request for conflict detection
    const insertResult = await userDB.insert(userDoc);

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      updatedUserDetails: { // Changed from 'user' to 'updatedUserDetails'
        ...userDoc,
        _rev: insertResult.rev,
      },
    });
    
  } catch (error) {
    console.error("🔥 Error updating user profile:", error);
    
    // Handle CouchDB conflicts
    if (error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        message: "Document conflict. Please refresh and try again.",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both old and new passwords are required",
      });
    }

    // Fetch user document from CouchDB
    let userDoc;
    try {
      userDoc = await userDB.get(userId);
    } catch (err) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, userDoc.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "The current password is incorrect",
      });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userDoc.password = hashedPassword;
    userDoc.updatedAt = new Date().toISOString();

    await userDB.insert(userDoc);

    // Send email notification
    try {
      await mailSender(
        userDoc.email,
        "Password for your Codash account has been updated",
        passwordUpdated(
          userDoc.email,
          `Password updated successfully for ${userDoc.fullName}`
        )
      );
    } catch (error) {
      console.warn("Failed to send email:", error.message);
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id; // Extracted from JWT middleware (e.g., "user:email@example.com")

    // Fetch user document
    let userDoc;
    try {
      userDoc = await userDB.get(id);
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user document (you need _rev to delete in CouchDB)
    await userDB.destroy(userDoc._id, userDoc._rev);

    // If you stored additional profile docs (e.g., profile:user@example.com), delete them too
    // Replace with your actual key or structure if used
    const profileId = `profile:${userDoc.email}`;
    try {
      const profileDoc = await userDB.get(profileId);
      await userDB.destroy(profileId, profileDoc._rev);
    } catch (profileErr) {
      // Optional: log, but don't fail if profile doc doesn't exist
      console.warn("No separate profile found to delete:", profileErr.reason);
    }


    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};