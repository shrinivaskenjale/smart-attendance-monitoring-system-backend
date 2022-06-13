// packages
const mongoose = require("mongoose");

// import models
const Attendance = require("../models/attendance");
const User = require("../models/user");
const Token = require("../models/token");

// import helpers

// ====================================
// MARK ATTENDANCE OF THE STUDENT
// ====================================

const markAttendance = async (req, res, next) => {
  try {
    const { attendanceId } = req.params;
    const { userId } = req.body;

    if (req.user.type !== "faculty") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    if (!userId) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      // error.data if individual validation present
      throw error;
    }

    const user = await User.findById(userId);
    if (!user || user.type !== "student") {
      const error = new Error("Student does not exist.");
      error.statusCode = 422;
      throw error;
    }
    //   person exists
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      const error = new Error("Attendance record does not exist.");
      error.statusCode = 422;
      throw error;
    }
    //  attendance exists
    //   add person to present list
    attendance.present.push(user._id);
    const result = await attendance.save();
    res.status(200).json({
      message: "Marked attendance.",
    });
  } catch (error) {
    next(error);
  }
};

// ====================================
// FETCH RECORDS FOR GIVEN DATE OR RANGE OF DATES
// ====================================

const getRecords = async (req, res, next) => {
  try {
    let records;
    let conductedLecturesCount = 0;
    let studentsCount = 0;
    const { date1, date2, divisionId, subjectId } = req.body;
    const { facultyId } = req.params;

    if (req.user.type !== "faculty") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    if (!facultyId) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      // error.data if individual validation present
      throw error;
    }

    if (!date2 && !date1) {
      records = await Attendance.find({
        faculty: facultyId,
        divisionId: divisionId,
        subjectId: subjectId,
      }).sort("-createdAt");
      conductedLecturesCount = records.length;
    } else if (!date2) {
      const date = new Date(date1);

      records = await Attendance.find({
        createdAt: {
          $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          $lt: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1
          ),
        },
        faculty: facultyId,
        divisionId: divisionId,
        subjectId: subjectId,
      }).sort("-createdAt");
      conductedLecturesCount = records.length;
    } else {
      const fromDate1 = new Date(date1);
      const toDate2 = new Date(date2);
      records = await Attendance.find({
        createdAt: {
          $gte: new Date(
            fromDate1.getFullYear(),
            fromDate1.getMonth(),
            fromDate1.getDate()
          ),
          $lt: new Date(
            toDate2.getFullYear(),
            toDate2.getMonth(),
            toDate2.getDate() + 1
          ),
        },
        faculty: facultyId,
        divisionId: divisionId,
        subjectId: subjectId,
      }).sort("-createdAt");
      conductedLecturesCount = records.length;
    }
    studentsCount = await User.countDocuments({
      type: "student",
    });

    res.status(200).json({
      message: "Fetched records.",
      type: "all",
      records,
      conductedLecturesCount,
      studentsCount,
    });
  } catch (error) {
    next(error);
  }
};

// ====================================
// FETCH RECORDS FOR GIVEN STUDENT DATE OR RANGE OF DATES
// ====================================

const getStudentRecords = async (req, res, next) => {
  try {
    let records;
    let conductedLecturesCount = 0;

    const { date1, date2, studentId, subjectId, divisionId } = req.body;
    const { facultyId } = req.params;

    if (req.user.type !== "faculty") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    if (!facultyId) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      // error.data if individual validation present
      throw error;
    }

    if (!date2 && !date1) {
      records = await Attendance.find({
        faculty: facultyId,
        present: studentId,
        divisionId: divisionId,
        subjectId: subjectId,
      }).sort("-createdAt");
      conductedLecturesCount = await Attendance.countDocuments({
        faculty: facultyId,
      });
    } else if (!date2) {
      const date = new Date(date1);

      records = await Attendance.find({
        createdAt: {
          $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          $lt: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1
          ),
        },
        faculty: facultyId,
        present: studentId,
        divisionId: divisionId,
        subjectId: subjectId,
      }).sort("-createdAt");
      conductedLecturesCount = await Attendance.countDocuments({
        createdAt: {
          $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          $lt: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1
          ),
        },
        faculty: facultyId,
        divisionId: divisionId,
        subjectId: subjectId,
      });
    } else {
      const fromDate1 = new Date(date1);
      const toDate2 = new Date(date2);
      records = await Attendance.find({
        createdAt: {
          $gte: new Date(
            fromDate1.getFullYear(),
            fromDate1.getMonth(),
            fromDate1.getDate()
          ),
          $lt: new Date(
            toDate2.getFullYear(),
            toDate2.getMonth(),
            toDate2.getDate() + 1
          ),
        },
        faculty: facultyId,
        present: studentId,
        divisionId: divisionId,
        subjectId: subjectId,
      }).sort("-createdAt");
      conductedLecturesCount = await Attendance.countDocuments({
        createdAt: {
          $gte: new Date(
            fromDate1.getFullYear(),
            fromDate1.getMonth(),
            fromDate1.getDate()
          ),
          $lt: new Date(
            toDate2.getFullYear(),
            toDate2.getMonth(),
            toDate2.getDate() + 1
          ),
        },
        faculty: facultyId,
        divisionId: divisionId,
        subjectId: subjectId,
      });
    }

    res.status(200).json({
      message: "Fetched records.",
      type: "single",
      records,
      conductedLecturesCount,
    });
  } catch (error) {
    next(error);
  }
};

// ====================================
// FIND ATTENDACNE WITH GIVEN ID
// ====================================

const getAttendanceRecord = async (req, res, next) => {
  try {
    const { attendanceId } = req.params;
    const { edit } = req.query;

    if (req.user.type !== "faculty") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    let record;
    if (edit) {
      record = await Attendance.findById(attendanceId);

      if (!record) {
        const error = new Error("Record does not exist.");
        error.statusCode = 404;
        throw error;
      }

      const presentStudentIds = new Set();

      record.present.forEach((id) => {
        presentStudentIds.add(id.toString());
      });

      const allStudents = await User.find({
        type: "student",
      }).sort("rollNumber");

      if (!allStudents) {
        const error = new Error("Students not found.");
        error.statusCode = 404;
        throw error;
      }

      record = allStudents.map((student) => {
        let obj = {
          _id: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
        };
        if (presentStudentIds.has(student._id.toString())) {
          obj.present = true;
        } else {
          obj.present = false;
        }
        return obj;
      });
    } else {
      record = await Attendance.findById(attendanceId).populate("present");
      // .sort("present.rollNumber");
      if (!record) {
        const error = new Error("Record does not exist.");
        error.statusCode = 404;
        throw error;
      }
    }
    res.status(200).json({ message: "Fetched record.", record });
  } catch (error) {
    next(error);
  }
};

// ====================================
// UPDATE ATTENDACNE WITH GIVEN ID
// ====================================

const updateAttendanceRecord = async (req, res, next) => {
  try {
    const { attendanceId } = req.params;
    const { updatedRecord } = req.body;

    if (req.user.type !== "faculty") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    if (!updatedRecord || updatedRecord.length === 0) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      // error.data if individual validation present
      throw error;
    }

    let record = await Attendance.findById(attendanceId);

    if (!record) {
      const error = new Error("Record does not exist.");
      error.statusCode = 404;
      throw error;
    }

    const updatedPresent = [];
    updatedRecord.forEach((student) => {
      if (student.present) {
        updatedPresent.push(student._id);
      }
    });

    record.present = updatedPresent;
    const result = await record.save();
    res.status(200).json({ message: "Updated record." });
  } catch (error) {
    next(error);
  }
};

// ====================================
// DELETE ATTENDACNE WITH GIVEN ID
// ====================================

const deleteRecord = async (req, res, next) => {
  try {
    const { attendanceId } = req.params;

    if (req.user.type !== "faculty") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    let record = await Attendance.findById(attendanceId);
    if (!record) {
      const error = new Error("Record does not exist.");
      error.statusCode = 404;
      throw error;
    }

    if (req.user._id !== record.faculty.toString()) {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    const result = await Attendance.findByIdAndDelete(attendanceId);
    res.status(200).json({ message: "Deleted record." });
  } catch (error) {
    next(error);
  }
};

// ====================================
// CONFIGURE ATTENDANCE
// ====================================
const configureAttendance = async (req, res, next) => {
  try {
    const { divisionId, subjectId } = req.body;
    const { attendanceId, token } = req.params;

    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      const error = new Error("Link is invalid or expired.");
      error.statusCode = 401;
      throw error;
    }

    const tokenDB = await Token.findOne({
      attendanceId: attendance._id,
      token: token,
    });
    if (!tokenDB) {
      const error = new Error("Link is invalid or expired.");
      error.statusCode = 401;
      throw error;
    }

    attendance.divisionId = divisionId;
    attendance.subjectId = subjectId;
    await attendance.save();
    await tokenDB.delete();

    res.status(200).json({
      message: "Thank you.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getRecords,
  getStudentRecords,
  getAttendanceRecord,
  updateAttendanceRecord,
  deleteRecord,
  configureAttendance,
};
