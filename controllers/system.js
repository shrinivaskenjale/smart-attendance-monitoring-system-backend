// import models
const Attendance = require("../models/attendance");
const User = require("../models/user");
const Token = require("../models/token");

// core packages
const crypto = require("crypto");

// import helpers
const { sendAttendanceCreationAlert } = require("../helpers/email");

// ====================================
// CREATE NEW ATTENDANCE RECORD
// ====================================

const createNewAttendance = async (req, res, next) => {
  const { facultyId } = req.body;
  const user = await User.findById(facultyId);
  if (!user || user.type !== "faculty") {
    return;
  }
  // faculty exists
  const newAttendance = new Attendance({
    faculty: user._id,
  });
  const result = await newAttendance.save();

  // configure link

  const token = await new Token({
    attendanceId: result._id,
    token: crypto.randomBytes(32).toString("hex"),
  }).save();

  const link = `${process.env.FRONTEND_BASE_URL}/configure/${result._id}/${token.token}`;

  // sending email
  const info = await sendAttendanceCreationAlert(
    user.email,
    user.name,
    result._id,
    link
  );

  //   sending response
  res.json({
    attendanceId: result._id,
    facultyName: user.name,
  });
};

// ====================================
// MARK ATTENDANCE OF THE STUDENT
// ====================================

const markAttendance = async (req, res, next) => {
  const { attendanceId } = req.params;
  const { studentId } = req.body;

  const user = await User.findById(studentId);
  if (!user || user.type !== "student") {
    return;
  }
  //   person exists
  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    return;
  }
  //  attendance exists
  //   add person to present list
  attendance.present.push(user._id);
  const result = await attendance.save();
  res.json({
    userName: user.name,
  });
};

// ====================================
// SEND IMAGE URL TO SYSTEM
// ====================================

const getImageUrls = async (req, res, next) => {
  const imageUrls = await User.find();
  res.json(imageUrls);
};

// exports

module.exports = {
  createNewAttendance,
  markAttendance,
  getImageUrls,
};
