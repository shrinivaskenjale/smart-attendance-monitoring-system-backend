// import models
const Attendance = require("../models/attendance");
const User = require("../models/user");

// import helpers
const email = require("../helpers/email");

// ====================================
// FETCH RECORDS FOR GIVEN STUDENT DATE OR RANGE OF DATES
// ====================================

const getStudentRecords = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { date1, date2, subjectId } = req.body;

    if (req.user.type !== "student") {
      const error = new Error("You are not authorized to perform this action.");
      error.statusCode = 403;
      throw error;
    }

    let records;
    let conductedLecturesCount = 0;

    if (!subjectId || subjectId.length === 0) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      // error.data if individual validation present
      throw error;
    }

    if (!date2 && !date1) {
      records = await Attendance.find({
        subjectId: subjectId,
        present: studentId,
      }).sort("-createdAt");
      conductedLecturesCount = await Attendance.countDocuments({
        subjectId: subjectId,
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
        subjectId: subjectId,
        present: studentId,
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
        subjectId: subjectId,
        present: studentId,
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
        subjectId: subjectId,
      });
    }
    res.json({
      message: "Fetched records.",
      type: "single",
      records,
      conductedLecturesCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStudentRecords };
