const nano = require("nano");
const couch = nano(process.env.COUCHDB_URL);
const userDB = couch.db.use("codash");
const otpDB = couch.db.use("codash");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");

exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    try {
      await userDB.get(`user:${email}`);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    } catch (err) {
      if (err.statusCode !== 404) {
        return res.status(500).json({ success: false, message: err.reason });
      }
    }

    // Generate unique OTP
    let otp;
    let existingOtp;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });

      const result = await otpDB.find({
        selector: { otp },
        limit: 1,
      });

      existingOtp = result.docs.length > 0;
    } while (existingOtp);

    // Save OTP in CouchDB
    const otpDoc = {
      _id: `otp:${email}:${Date.now()}`,
      email,
      otp,
      createdAt: new Date().toISOString(),
    };

    await otpDB.insert(otpDoc);

    // Generate HTML from your template and send email
    const htmlBody = otpTemplate(otp);
    await mailSender(email, "CodeHive | OTP Verification", htmlBody);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, otp } = req.body;

    if (!fullName || !email || !confirmPassword || !password || !otp) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Check if user already exists
    try {
      await userDB.get(`user:${email}`);
      return res.status(400).json({ success: false, message: "User already exists" });
    } catch (err) {
      if (err.statusCode !== 404) {
        return res.status(500).json({ success: false, message: err.reason });
      }
    }

    // Ensure index for OTP lookup exists
    try {
      await otpDB.createIndex({
        index: { fields: ["email", "createdAt"] },
        name: "email-createdAt-index",
        ddoc: "email-createdAt-ddoc",
        type: "json",
      });
    } catch (e) {
      console.warn("Index creation warning:", e.message);
    }

    // Fetch latest OTP for this email
    const otps = await otpDB.find({
      selector: { email },
      sort: [{ createdAt: "desc" }],
      limit: 1,
    });

    if (!otps.docs.length || otps.docs[0].otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = {
      _id: `user:${email}`,
      fullName,
      email,
      hackerRankURL: "",
      leetCodeURL: "",
      codeChefURL: "",
      gfgURL: "",
      codeforcesURL: "",
      password: hashedPassword,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${fullName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await userDB.insert(newUser);

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    // Try to get the user by ID (email-based _id)
    let user;
    try {
      user = await userDB.get(`user:${email}`);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // Generate JWT token
    const payload = {
      email: user.email,
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Set token and mask password
    user.token = token;
    delete user.password;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
      secure: true,
    };

    user.updatedAt = new Date();

    return res
      .cookie("token", token, options)
      .status(200)
      .json({
        success: true,
        token,
        user,
        message: "Logged In successfully",
      });

  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.logout = async (req, res) => {
  return res
    .status(200)
    .cookie("token", "", { expires: new Date(Date.now()) })
    .json({
      success: true,
      message: "Logout Successfully",
    });
};



