// import models
const User = require("../models/user");
const Division = require("../models/division");
const Subject = require("../models/subject");

// import helpers

// ====================================
// GET ALL STUDENTS
// ====================================
const getStudents = async (req, res, next) => {
  try {
    const { divisionId } = req.params;
    const students = await User.find({
      type: "student",
      division: divisionId,
    }).sort("rollNumber");

    if (!students) {
      const error = new Error("Students record does not exist.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Fetched students.", students });
  } catch (error) {
    next(error);
  }
};

// ====================================
// GET ALL FACULTY
// ====================================
const getFaculty = async (req, res, next) => {
  try {
    const faculty = await User.find({ type: "faculty" });
    if (!faculty) {
      const error = new Error("Faculty record does not exist.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Fetched faculty.", faculty });
  } catch (error) {
    next(error);
  }
};

// ====================================
// GET SINGLE PERSON
// ====================================
const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User does not exist.");
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: "Fetched details.", user });
  } catch (error) {
    next(error);
  }
};

// ====================================
// GET ALL divisions
// ====================================
const getDivisions = async (req, res, next) => {
  try {
    const divisions = await Division.find()
      .sort("division")
      .populate("subjects");

    if (!divisions) {
      const error = new Error("Class record does not exist.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Fetched classes.", divisions });
  } catch (error) {
    next(error);
  }
};

// ====================================
// GET SINGLE PERSON
// ====================================
const getSingleDivision = async (req, res, next) => {
  try {
    const { divisionId } = req.params;

    const division = await Division.findById(divisionId).populate("subjects");
    if (!division) {
      const error = new Error("Class does not exist.");
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: "Fetched details.", division });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getFaculty,
  getUserDetails,
  getDivisions,
  getSingleDivision,
};
