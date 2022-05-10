// express
const express = require("express");
const router = express.Router();

// import controllers
const studentController = require("../controllers/student");
const { protectRoute } = require("../middlewares/auth");

// routes
router.post(
  "/records/students/:studentId",
  protectRoute,
  studentController.getStudentRecords
);

// exports
module.exports = router;
