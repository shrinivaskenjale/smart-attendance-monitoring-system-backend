// import models

const User = require("../models/user");

// import helpers
const { hashPassword } = require("../helpers/auth");
const { sendRegistrationMail } = require("../helpers/email");

// ====================================
// CREATE NEW PERSON
// ====================================

const addNewUser = async (req, res, next) => {
  try {
    let { name, rollNumber, type, imageUrl, email, division, password } =
      req.body;

    if (req.user.type !== "admin") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    if (!name || !imageUrl || !email || !password) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      // error.data if individual validation present
      throw error;
    }
    name = name.trim();
    imageUrl = imageUrl.trim();
    email = email.trim();
    password = password.trim();
    if (name === "" || imageUrl === "" || email === "" || password === "") {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      // error.data if individual validation present
      throw error;
    }

    let newUser;

    const user = await User.findOne({ email: email });
    if (user) {
      const error = new Error("Email already exists.");
      error.statusCode = 422;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    if (type === "faculty") {
      newUser = new User({
        name,
        type,
        imageUrl,
        email,
        password: hashedPassword,
      });
    } else if (type === "student") {
      newUser = new User({
        name,
        rollNumber,
        imageUrl,
        email,
        type,
        password: hashedPassword,
        division,
      });
    }

    const result = await newUser.save();
    res.status(201).json({
      message: "User created.",
      userId: result._id,
    });
    sendRegistrationMail(
      email,
      password,
      `${process.env.FRONTEND_BASE_URL}/reset-password`
    );
  } catch (error) {
    next(error);
  }
};

// ====================================
// DELETE PERSON
// ====================================
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.type !== "admin") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User does not exist.");
      error.statusCode = 404;
      throw error;
    }
    const result = await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Deleted user." });
  } catch (error) {
    next(error);
  }
};

// ====================================
// UPDATE PERSON
// ====================================
const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let { name, rollNumber, imageUrl, email, division } = req.body;

    if (req.user.type !== "admin") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    if (!name || !imageUrl || !email) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      // error.data if individual validation present
      throw error;
    }
    name = name.trim();
    imageUrl = imageUrl.trim();
    email = email.trim();

    if (name === "" || imageUrl === "" || email === "") {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      // error.data if individual validation present
      throw error;
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User does not exist.");
      error.statusCode = 404;
      throw error;
    }

    user.name = name;
    user.imageUrl = imageUrl;
    user.email = email;
    if (user.type === "student") {
      user.rollNumber = rollNumber;
      user.division = division;
    }

    const result = await user.save();

    res.status(200).json({ message: "Updated data." });
  } catch (error) {
    next(error);
  }
};

// ====================================
// CLEAR ALL STUDENTS
// ====================================
const clearStudents = async (req, res, next) => {
  try {
    const { divisionId } = req.params;
    if (req.user.type !== "admin") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    const result = await User.deleteMany({
      type: "student",
      division: divisionId,
    });

    res.status(200).json({ message: "Deleted all students." });
  } catch (error) {
    next(error);
  }
};

// ====================================
// CLEAR ALL FACULTY
// ====================================
const clearFaculty = async (req, res, next) => {
  try {
    if (req.user.type !== "admin") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }
    const result = User.deleteMany({ type: "faculty" });
    res.status(200).json({ message: "Deleted all faculty." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNewUser,
  deleteUser,
  updateUser,
  clearFaculty,
  clearStudents,
};
