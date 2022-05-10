// express
const express = require("express");
const router = express.Router();

// import controllers
const { protectRoute } = require("../middlewares/auth");
const facultyController = require("../controllers/faculty");

// routes

router.post("/records", protectRoute, facultyController.getRecords);

router.post(
  "/records/students/:studentId",
  protectRoute,
  facultyController.getStudentRecords
);

router.get(
  "/records/:attendanceId",
  protectRoute,
  facultyController.getAttendanceRecord
);
router.post(
  "/records/:attendanceId",
  protectRoute,
  facultyController.updateAttendanceRecord
);

router.post(
  "/mark-attendance/:attendanceId",
  protectRoute,
  facultyController.markAttendance
);

router.delete(
  "/delete-record/:attendanceId",
  protectRoute,
  facultyController.deleteRecord
);

// exports
module.exports = router;
