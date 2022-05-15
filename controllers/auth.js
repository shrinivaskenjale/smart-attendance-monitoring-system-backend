// core packages
const crypto = require("crypto");

// import models

const User = require("../models/user");
const Token = require("../models/token");

// import helpers
const {
  verifyPasswords,
  generateToken,
  hashPassword,
} = require("../helpers/auth");
const { sendResetLink } = require("../helpers/email");

// ====================================
// LOG IN
// ====================================
const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User with this email doesn't exist.");
      error.statusCode = 401;
      throw error;
    }

    const isValid = await verifyPasswords(password, user.password);
    if (!isValid) {
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      email: user.email,
      _id: user._id.toString(),
      type: user.type,
    });

    res.status(200).json({
      message: "Log in successful",
      token: token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        type: user.type,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ====================================
// SEND PASSWORD RESET LINK
// ====================================
const resetRequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User with this email doesn't exist.");
      error.statusCode = 401;
      throw error;
    }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.FRONTEND_BASE_URL}/reset-password/${user._id}/${token.token}`;
    const info = await sendResetLink(user.email, link);

    res.status(200).json({
      message: "Password reset link has been sent to your email address.",
    });
  } catch (error) {
    next(error);
  }
};

// ====================================
// RESET PASSWORD
// ====================================
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { userId, token } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Link is invalid or expired.");
      error.statusCode = 401;
      throw error;
    }

    const tokenDB = await Token.findOne({ userId: user._id, token: token });
    if (!tokenDB) {
      const error = new Error("Link is invalid or expired.");
      error.statusCode = 401;
      throw error;
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    await user.save();
    await tokenDB.delete();

    res.status(200).json({
      message: "Password changed. You can now log in with new password.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginHandler, resetRequestHandler, resetPassword };

// check email function error handling
