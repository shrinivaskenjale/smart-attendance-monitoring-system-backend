// express
const express = require("express");
const router = express.Router();

// import controllers
const { protectRoute } = require("../middlewares/auth");
const facultyController = require("../controllers/faculty");

// routes

router.post(
  "/records/faculty/:facultyId",
  protectRoute,
  facultyController.getRecords
);

router.post(
  "/records/students/:facultyId",
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

router.post(
  "/configure/:attendanceId/:token",
  facultyController.configureAttendance
);

// exports
module.exports = router;
